import {type ReactElement, useRef} from "react"
import {useMouseHovered} from "react-use"

export type EpisodeTableOverlayProps = {
	tableScroll: [number, number]
}

export default function EpisodeTableOverlay({tableScroll}: EpisodeTableOverlayProps): ReactElement | null {
	const ref = useRef(null)
	const {elX, elY} = useMouseHovered(ref)

	const x = Math.max(Math.floor(elX / 16), 0)
	const y = Math.max(Math.floor(elY / 16) + 1, 0)

	return (
		<div className="absolute left-40 top-0 z-30 h-full w-full" ref={ref}>
			<div
				className="absolute h-4 w-4 outline outline-2 outline-red-500 transition-transform duration-[50ms]"
				style={{transform: `translate(${x * 16}px, ${y * 16}px)`}}
			/>
			<span
				className="sticky top-px z-20 -mt-px inline-block h-3.5 w-max rounded bg-red-500 px-0.5 text-xs text-zinc-50 transition-transform duration-[50ms]"
				style={{transform: `translateX(calc(${x * 16}px - 50% + 0.5rem))`}}
			>
				{x}
			</span>

			{/* Vertical line */}
			<div
				className="absolute top-4 w-0.5 bg-red-600 transition-[height,transform] duration-[50ms]"
				style={{
					height: y * 16 - tableScroll[1] - 16,
					transform: `translate(calc(${x * 16}px + 0.5rem - 1px), ${tableScroll[1]}px)`,
				}}
			/>
			{/* Horizontal line */}
			<div
				className="absolute h-0.5 bg-red-600 transition-[height,transform] duration-[50ms]"
				style={{
					width: x * 16 - tableScroll[0],
					transform: `translate(${tableScroll[0]}px, calc(${y * 16}px - 0.5rem + 1px))`,
				}}
			/>
		</div>
	)
}
