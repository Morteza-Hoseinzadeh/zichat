import { Box } from '@mui/material';

export default function GlitchText({ text }: { text: string }) {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-block',
        fontWeight: '100',
        color: 'text.primary',
        textTransform: 'uppercase',
        letterSpacing: 1,
        '&::before, &::after': { content: `"${text}"`, position: 'absolute', top: 0, left: 0, width: '100%', overflow: 'hidden', color: '#A970FF', clipPath: 'inset(0 0 0 0)' },
        '&::before': { animation: 'glitchTop 2s infinite linear alternate-reverse', zIndex: -1 },
        '&::after': { animation: 'glitchBottom 2s infinite linear alternate-reverse', zIndex: -2, color: '#00FFAA' },
      }}
    >
      {text}
      <style jsx global>{`
        @keyframes glitchTop {
          0% {
            transform: translate(0);
            clip-path: inset(0 0 85% 0);
          }
          20% {
            transform: translate(-2px, -2px);
          }
          40% {
            transform: translate(2px, 2px);
          }
          60% {
            transform: translate(-1px, 1px);
            clip-path: inset(0 0 20% 0);
          }
          80% {
            transform: translate(1px, -1px);
          }
          100% {
            transform: translate(0);
            clip-path: inset(0 0 85% 0);
          }
        }

        @keyframes glitchBottom {
          0% {
            transform: translate(0);
            clip-path: inset(85% 0 0 0);
          }
          20% {
            transform: translate(2px, 2px);
          }
          40% {
            transform: translate(-2px, -1px);
          }
          60% {
            transform: translate(1px, 1px);
            clip-path: inset(60% 0 10% 0);
          }
          80% {
            transform: translate(-1px, -2px);
          }
          100% {
            transform: translate(0);
            clip-path: inset(85% 0 0 0);
          }
        }
      `}</style>
    </Box>
  );
}
