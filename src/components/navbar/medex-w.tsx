// medex-w.tsx
import { FC, SVGProps } from 'react';

interface MedexerIconProps extends SVGProps<SVGSVGElement> {
  fill?: string;
}

const Medexericon: FC<MedexerIconProps> = ({ className, style, fill = 'currentColor' }) => (
  <svg
        className={className}
        style={{ fill: fill, ...style }}
        viewBox="0 0 51 50"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M44.1509 0L44.18 0.0276838V0H50.4214V24.8455L50.4214 24.8455V31.0569H37.9386V24.8455L44.18 24.8455V8.95721L19.9228 34.2025L31.3834 45.6079L26.9701 50L15.6082 38.6928L4.93232 49.8037L0.421356 45.5109L11.1938 34.2996L0.489988 23.6474L4.90334 19.2553L15.5084 29.8093L44.1509 0ZM44.1799 34.1626H50.4213V49.691H44.1799V34.1626Z"
        />
    </svg>
);

export default Medexericon;
