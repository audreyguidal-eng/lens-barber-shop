import { prisma } from "./prisma";
import { fromDateKey } from "./utils";

export type Slot = { time: string; start: string; available: boolean };

/** Deux intervalles [aS,aE) et [bS,bE) se chevauchent-ils ? */
function overlaps(aS: number, aE: number, bS: number, bE: number): boolean {
  return aS < bE && bS < aE;
}

/**
 * Génère les créneaux disponibles pour une date et une prestation données.
 * Règles :
 *  - respecte les horaires d'ouverture (et la pause déjeuner)
 *  - exclut les créneaux occupés par un RDV existant
 *  - exclut les créneaux bloqués manuellement
 *  - exclut les jours de congés (vacances)
 *  - exclut les créneaux dans le passé
 *  - garantit que la prestation tient avant la fermeture
 */
export async function getAvailableSlots(
  dateKey: string,
  durationMin: number,
): Promise<{ open: boolean; reason?: string; slots: Slot[] }> {
  const day = fromDateKey(dateKey);
  const weekday = day.getDay();

  const settings = await prisma.settings.findFirst();
  const step = settings?.slotStepMin ?? 15;
  const buffer = settings?.bufferMin ?? 0;

  // Congés ?
  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(day);
  dayEnd.setHours(23, 59, 59, 999);

  const vacation = await prisma.vacation.findFirst({
    where: {
      startDate: { lte: dayEnd },
      endDate: { gte: dayStart },
    },
  });
  if (vacation) {
    return { open: false, reason: vacation.reason || "Congés", slots: [] };
  }

  // Horaires du jour
  const hours = await prisma.openingHours.findUnique({ where: { weekday } });
  if (!hours || !hours.isOpen) {
    return { open: false, reason: "Fermé", slots: [] };
  }

  // RDV existants (non annulés) du jour
  const appointments = await prisma.appointment.findMany({
    where: {
      start: { gte: dayStart, lte: dayEnd },
      status: { not: "CANCELLED" },
    },
    select: { start: true, end: true },
  });

  // Créneaux bloqués du jour
  const blocked = await prisma.blockedSlot.findMany({
    where: { start: { gte: dayStart, lte: dayEnd } },
    select: { start: true, end: true },
  });

  const busy = [
    ...appointments.map((a) => ({
      s: minutesOf(a.start),
      e: minutesOf(a.end) + buffer,
    })),
    ...blocked.map((b) => ({ s: minutesOf(b.start), e: minutesOf(b.end) })),
  ];

  const now = new Date();
  const isToday = now.toDateString() === day.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: Slot[] = [];
  for (let t = hours.openMinutes; t + durationMin <= hours.closeMinutes; t += step) {
    const slotStart = t;
    const slotEnd = t + durationMin;

    // Pause déjeuner
    let ok = true;
    if (
      hours.breakStart != null &&
      hours.breakEnd != null &&
      overlaps(slotStart, slotEnd, hours.breakStart, hours.breakEnd)
    ) {
      ok = false;
    }

    // Passé
    if (isToday && slotStart <= nowMinutes) ok = false;

    // Occupé / bloqué
    if (ok) {
      for (const b of busy) {
        if (overlaps(slotStart, slotEnd, b.s, b.e)) {
          ok = false;
          break;
        }
      }
    }

    const startDate = new Date(day);
    startDate.setHours(0, slotStart, 0, 0);

    slots.push({
      time: `${Math.floor(slotStart / 60)}h${(slotStart % 60)
        .toString()
        .padStart(2, "0")}`,
      start: startDate.toISOString(),
      available: ok,
    });
  }

  return { open: true, slots };
}

function minutesOf(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}
