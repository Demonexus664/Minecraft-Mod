// Injury table: name, body region, weight (relative frequency), min/max games out, lasting effects.
window.HL = window.HL || {};

HL.INJURIES = [
  { name: 'Ankle sprain', region: 'ankle', w: 22, min: 1, max: 12 },
  { name: 'Knee soreness', region: 'knee', w: 12, min: 1, max: 6 },
  { name: 'Hamstring strain', region: 'thigh', w: 10, min: 3, max: 18 },
  { name: 'Calf strain', region: 'calf', w: 7, min: 3, max: 20 },
  { name: 'Back spasms', region: 'back', w: 8, min: 1, max: 8 },
  { name: 'Groin strain', region: 'hip', w: 5, min: 3, max: 15 },
  { name: 'Hip contusion', region: 'hip', w: 4, min: 1, max: 5 },
  { name: 'Concussion', region: 'head', w: 4, min: 2, max: 12 },
  { name: 'Broken nose', region: 'head', w: 2, min: 0, max: 3 },
  { name: 'Finger sprain', region: 'hand', w: 6, min: 0, max: 6 },
  { name: 'Wrist sprain', region: 'hand', w: 3, min: 2, max: 10 },
  { name: 'Shoulder sprain', region: 'shoulder', w: 4, min: 3, max: 16 },
  { name: 'Plantar fasciitis', region: 'foot', w: 3, min: 5, max: 25 },
  { name: 'Foot stress fracture', region: 'foot', w: 1.5, min: 20, max: 50, lasting: { speed: -1 } },
  { name: 'Torn meniscus', region: 'knee', w: 1.5, min: 15, max: 45, lasting: { speed: -1, vert: -1 } },
  { name: 'MCL sprain', region: 'knee', w: 2, min: 8, max: 30 },
  { name: 'Broken hand', region: 'hand', w: 1.2, min: 15, max: 35 },
  { name: 'Torn ACL', region: 'knee', w: 0.6, min: 60, max: 90, lasting: { speed: -4, vert: -5, layup: -1 } },
  { name: 'Torn Achilles', region: 'ankle', w: 0.5, min: 70, max: 100, lasting: { speed: -6, vert: -7, dunk: -3, stam: -2 } },
  { name: 'Herniated disc', region: 'back', w: 0.5, min: 20, max: 60, lasting: { str: -2, stam: -2 } },
];

HL.rollInjury = function (severityMult = 1) {
  const inj = HL.RNG.weighted(HL.INJURIES, i => i.w);
  const games = Math.max(0, Math.round(HL.RNG.range(inj.min, inj.max) * severityMult));
  return { name: inj.name, region: inj.region, games, lasting: inj.lasting || null };
};
