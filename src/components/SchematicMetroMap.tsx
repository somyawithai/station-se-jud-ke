import React from 'react';
import { MetroCity } from '../types/metro';
import { StationLayoutNode } from '../utils/metroSchematicLayout';

interface SchematicMetroMapProps {
  city: MetroCity;
  selectedLineId: string;
  stationSearchQuery: string;
  onSelectStation: (station: StationLayoutNode) => void;
  onLineChange: (lineId: string) => void;
  selectedStationNode: StationLayoutNode | null;
  pinnedStationName?: string | null;
  communityConnectedStationKeys?: ReadonlySet<string>;
}

export const SchematicMetroMap: React.FC<SchematicMetroMapProps> = ({
  city,
  selectedLineId,
  stationSearchQuery,
  onSelectStation,
}) => {
  const query = stationSearchQuery.trim().toLowerCase();
  const lines = selectedLineId === 'all'
    ? city.lines
    : city.lines.filter((line) => line.id === selectedLineId);

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 p-4">
      <div className="space-y-4">
        {lines.map((line) => {
          const stations = line.stations
            .map((name, index) => ({ name, index }))
            .filter(({ name }) => !query || name.toLowerCase().includes(query));

          if (stations.length === 0) return null;

          return (
            <div key={line.id}>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-stone-200">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: line.colorHex }}
                />
                {line.name}
              </div>
              <div className="flex flex-col gap-1">
                {stations.map(({ name, index }) => {
                  const isInterchange = line.interchangeStations.includes(name);
                  const node: StationLayoutNode = {
                    id: `${line.id}-${index}`,
                    name,
                    lineId: line.id,
                    lineName: line.name,
                    lineColor: line.colorHex,
                    stationNumber: index + 1,
                    isInterchange,
                    isFirst: index === 0,
                    isLast: index === line.stations.length - 1,
                    connectedLines: [{ id: line.id, name: line.name, color: line.colorHex }],
                    x: 0,
                    y: 0,
                    labelPosition: 'right',
                    labelAngle: 0,
                    labelOffsetX: 0,
                    labelOffsetY: 0,
                  };

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => onSelectStation(node)}
                      className="rounded-xl border border-stone-800 bg-stone-950 px-3 py-2 text-left text-sm text-stone-100"
                    >
                      <span className="font-semibold">{name}</span>
                      {isInterchange && (
                        <span className="ml-2 text-[10px] font-bold uppercase text-emerald-400">
                          Interchange
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
