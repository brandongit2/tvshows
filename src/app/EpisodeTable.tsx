"use client"

import {useRef} from "react"
import {useScroll, useWindowScroll} from "react-use"

import type {ReactElement} from "react"

const cellSize = 16

export type EpisodeTableProps = {
	table: string[][]
}

export default function EpisodeTable({table}: EpisodeTableProps): ReactElement | null {
	const width = table[0]?.length || 0
	const height = table.length

	const scrollRef = useRef(null)
	const {x} = useScroll(scrollRef)
	const {y} = useWindowScroll()

	const xMin = Math.max(0, Math.floor(x / cellSize))
	const xMax = Math.min(width, Math.ceil((x + window.innerWidth) / cellSize))
	const yMin = Math.max(0, Math.floor(y / cellSize))
	const yMax = Math.min(height, Math.ceil((y + window.innerHeight) / cellSize))

	return (
		<div className="overflow-auto" ref={scrollRef}>
			<div
				className="grid"
				style={{
					gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
					gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
				}}
			>
				<div style={{gridRow: `1 / span ${yMin}`, gridColumn: `1 / span ${xMax + 1}`}} />
				<div style={{gridRow: `1 / span ${yMax + 1}`, gridColumn: `1 / span ${xMin}`}} />

				{table.slice(yMin, yMax).map((row, i) =>
					row.slice(xMin, xMax).map((cell, j) => (
						<div
							key={`${i}-${j}`}
							className="border border-black"
							style={{
								gridRowStart: yMin + i + 1,
								gridColumnStart: xMin + j + 1,
								width: cellSize,
								height: cellSize,
								backgroundColor: cell,
							}}
						/>
					)),
				)}

				<div style={{gridRow: `1 / span ${height + 1}`, gridColumn: `${xMax + 1} / span ${width - xMax}`}} />
				<div style={{gridRow: `${yMax + 1} / span ${height - yMax}`, gridColumn: `1 / span ${width + 1}`}} />
			</div>
		</div>
	)
}
