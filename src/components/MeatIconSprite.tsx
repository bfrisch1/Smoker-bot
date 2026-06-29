/**
 * Hidden SVG sprite holding all 10 hand-drawn meat-cut symbols plus the
 * "pencil" turbulence filters that give them their sketched wobble. Rendered
 * once near the root of the app; individual icons reference these via
 * <use href="#m-..."/> in <MeatIcon />.
 *
 * Artwork ported verbatim from the Butcher's Log design handoff. These are
 * intentionally swappable placeholders (first-pass pencil sketches).
 */
export function MeatIconSprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
    >
      <defs>
        <filter id="pencil" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.022"
            numOctaves="2"
            seed="7"
            result="t"
          />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.1" />
        </filter>
        <filter id="pencilfine" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="2"
            seed="4"
            result="t"
          />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="1.3" />
        </filter>
      </defs>

      <symbol id="m-brisket" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#9a7b58" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M16,34 l7,4 M21,32 l7,4 M26,31 l7,4 M31,31 l7,4 M36,31 l7,4 M41,32 l6,4" />
        </g>
        <g filter="url(#pencil)" stroke="#7a5a3c" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12,30 C20,24 30,23 40,25 C47,26.5 52,29 53,33" />
          <path d="M19,42 C28,45 40,45 48,42" />
          <path d="M30,25 C31,33 30,40 29,46" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10,38 C9,30 19,21 33,21 C46,21 56,27 55,36 C54,43 44,49 28,49 C17,49 11,45 10,38 Z" />
        </g>
      </symbol>

      <symbol id="m-porkbutt" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#9a7b58" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M16,40 l6,5 M21,38 l6,5 M37,38 l6,5 M42,40 l6,5" />
        </g>
        <g filter="url(#pencil)" stroke="#7a5a3c" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22,22 C26,28 26,40 23,48" />
          <path d="M42,22 C38,28 38,40 41,48" />
          <circle cx="32" cy="44" r="2.5" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21,18 C28,15 37,15 44,18 C51,21 53,28 52,36 C51,45 44,50 32,50 C20,50 13,45 12,36 C11,28 14,21 21,18 Z" />
          <path d="M28,49 C30,52 34,52 36,49" />
        </g>
      </symbol>

      <symbol id="m-steak" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#a07f5b" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.85">
          <path d="M24,26 c3,2 5,5 4,9 M30,24 c3,3 4,7 3,11 M36,25 c2,3 3,7 2,11 M28,38 c3,1 6,1 9,0" />
        </g>
        <g filter="url(#pencil)" stroke="#7a5a3c" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19,28 C24,21 33,19 41,22 C46,24 49,29 48,35" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14,32 C12,22 24,14 35,16 C49,18 54,29 51,40 C48,50 33,53 22,48 C15,44 16,39 14,32 Z" />
          <path d="M44,21 C49,20 53,23 51,28 C49,32 44,31 43,27" strokeWidth="1.6" />
        </g>
      </symbol>

      <symbol id="m-chuck" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#a07f5b" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.85">
          <path d="M24,26 l4,6 M30,24 l4,7 M36,25 l4,6 M22,34 l5,4 M34,34 l5,4" />
        </g>
        <g filter="url(#pencil)" stroke="#7a5a3c" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19,30 C26,25 38,25 45,31" />
          <path d="M21,40 C28,43 38,43 44,39" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32,14 C46,14 52,24 51,34 C50,44 41,49 31,49 C20,49 13,42 13,32 C13,22 19,14 32,14 Z" />
        </g>
      </symbol>

      <symbol id="m-chicken" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#a07f5b" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M24,30 c4,2 7,5 7,9 M30,28 c4,3 6,7 6,11 M36,30 c3,3 4,6 4,9" />
        </g>
        <g filter="url(#pencil)" stroke="#7a5a3c" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22,26 C28,24 34,25 38,29" />
          <path d="M40,33 C44,32 46,35 44,38" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19,28 C18,19 29,14 38,18 C47,22 49,32 44,40 C39,48 27,50 20,44 C15,40 20,35 19,28 Z" />
          <path d="M27,47 l-2,6 M25,53 l5,1" strokeWidth="1.6" />
          <path d="M37,46 l3,6 M40,52 l-5,0" strokeWidth="1.6" />
        </g>
      </symbol>

      <symbol id="m-turkey" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#a07f5b" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M24,32 c4,2 8,5 8,9 M30,30 c4,3 6,7 6,11 M37,32 c3,2 4,6 4,8" />
        </g>
        <g filter="url(#pencil)" stroke="#7a5a3c" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24,28 C30,26 38,27 43,32" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16,32 C16,22 29,15 41,20 C52,25 52,40 42,46 C32,52 19,49 16,40 C14,37 15,35 16,32 Z" />
          <path d="M25,19 C22,12 28,8 31,15" strokeWidth="1.6" />
          <path d="M42,19 C46,12 40,7 37,15" strokeWidth="1.6" />
        </g>
      </symbol>

      <symbol id="m-babyback" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#a07f5b" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M14,30 l4,3 M14,36 l4,3 M48,30 l4,3 M48,36 l4,3" />
        </g>
        <g filter="url(#pencil)" stroke="#cdb789" strokeWidth="3.4" fill="none" strokeLinecap="round">
          <path d="M20,22 V46" />
          <path d="M28,20 V47" />
          <path d="M36,20 V47" />
          <path d="M44,22 V46" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11,25 C25,17 39,17 53,25 C54,31 52,42 49,46 C37,50 27,50 15,46 C12,42 10,31 11,25 Z" />
          <path d="M20,22 V46 M28,20 V47 M36,20 V47 M44,22 V46" strokeWidth="1.6" />
        </g>
      </symbol>

      <symbol id="m-spareribs" viewBox="0 0 64 64">
        <g filter="url(#pencil)" stroke="#cdb789" strokeWidth="3.2" fill="none" strokeLinecap="round">
          <path d="M19,24 V44" />
          <path d="M27,24 V44" />
          <path d="M35,24 V44" />
          <path d="M43,24 V44" />
          <path d="M51,24 V44" />
        </g>
        <g filter="url(#pencilfine)" stroke="#a07f5b" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M12,30 l4,0 M12,38 l4,0" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12,22 H53 Q56,22 55,26 L53,44 Q52,46 50,46 H14 Q11,46 10,43 L9,26 Q9,22 12,22 Z" />
          <path d="M19,24 V44 M27,24 V44 M35,24 V44 M43,24 V44 M51,24 V44" strokeWidth="1.5" />
        </g>
      </symbol>

      <symbol id="m-porkbelly" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#9a7b58" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M14,29 l6,0 M30,29 l6,0 M44,29 l6,0 M14,38 l6,0 M30,38 l6,0 M44,38 l6,0" />
        </g>
        <g filter="url(#pencil)" stroke="#7a5a3c" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10,30.5 H54" />
          <path d="M10,37.5 H54" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11,25 H53 Q56,25 56,28 V41 Q56,44 53,44 H11 Q8,44 8,41 V28 Q8,25 11,25 Z" />
        </g>
      </symbol>

      <symbol id="m-salmon" viewBox="0 0 64 64">
        <g filter="url(#pencilfine)" stroke="#a07f5b" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M20,30 c4,1 4,5 0,6 M28,29 c4,1 4,6 0,7 M36,30 c4,1 4,5 0,6 M44,31 c3,1 3,4 0,5" />
        </g>
        <g filter="url(#pencil)" stroke="#7a5a3c" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18,28 C28,26 40,27 47,31" />
        </g>
        <g filter="url(#pencil)" stroke="#3A2817" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13,32 C22,24 39,23 48,29 C50,30.5 51,31.5 51,32.5 L58,26 L56,39 L51,33 C51,34 50,35 48,36 C39,42 22,41 13,33 Z" />
        </g>
        <circle cx="21" cy="31" r="1.6" fill="#3A2817" />
      </symbol>
    </svg>
  );
}
