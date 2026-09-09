import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, X, CheckCircle2, AlertTriangle, 
  Copy, Check, Layers, Table, Database, Info
} from 'lucide-react';
import { EXCEL_AUDIT_DATA } from '../data/auditData';

interface DatasetAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatasetAuditModal: React.FC<DatasetAuditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const text = `Authoritative Excel Dataset Audit (Metro-List.xlsx):
- Cities Detected: ${EXCEL_AUDIT_DATA.citiesDetected} operational metro city systems (including Delhi Metro and Meerut Metro separately)
- Metro Lines Detected: ${EXCEL_AUDIT_DATA.metroLinesDetected}
- Stations / Line-station records: ${EXCEL_AUDIT_DATA.totalStationRecords} records
- Sheets & Columns verified:
${EXCEL_AUDIT_DATA.columnsFound.map(c => `  * ${c.sheetName}: [${c.columns.join(', ')}]`).join('\n')}
- Duplicate Observations:
${EXCEL_AUDIT_DATA.duplicateDataNotes.map(d => `  * ${d}`).join('\n')}
- Missing / Special Cases:
${EXCEL_AUDIT_DATA.missingDataNotes.map(m => `  * ${m}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        {/* LAG FIX: no full-screen blur on phones. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/90 md:bg-stone-950/80 md:backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 shadow-2xl ring-1 ring-white/10"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-stone-800 bg-stone-950/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-stone-100">
                  Authoritative Dataset Inspection & Audit Report
                </h2>
                <p className="text-xs text-stone-400">
                  Data verified strictly from <code className="font-mono text-amber-400">Metro-List.xlsx</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-stone-300 transition-colors hover:bg-stone-800 hover:text-stone-100"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Audit'}</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="max-h-[calc(90vh-130px)] space-y-6 overflow-y-auto p-6 text-stone-200">
            {/* Top 3 Core Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
                <div className="text-xs font-medium text-stone-400">Cities Detected</div>
                <div className="font-display text-2xl font-black text-amber-400">
                  {EXCEL_AUDIT_DATA.citiesDetected} Cities
                </div>
                <p className="mt-1 text-[11px] text-stone-400">
                  19 operational metro networks + Bhopal & Meerut + Delhi–Meerut Regional Transit.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
                <div className="text-xs font-medium text-stone-400">Metro Lines Detected</div>
                <div className="font-display text-2xl font-black text-stone-100">
                  {EXCEL_AUDIT_DATA.metroLinesDetected} Lines
                </div>
                <p className="mt-1 text-[11px] text-stone-400">
                  48 operational lines in main 19 cities + 4 lines/services in extended sections.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4">
                <div className="text-xs font-medium text-stone-400">Station Records Detected</div>
                <div className="font-display text-2xl font-black text-emerald-400">
                  {EXCEL_AUDIT_DATA.totalStationRecords} Records
                </div>
                <p className="mt-1 text-[11px] text-stone-400">
                  900 active line-station entries across primary 19 networks + 58 in supplemental sheets.
                </p>
              </div>
            </div>

            {/* Supabase Schema & Master Data Architecture */}
            <div>
              <h3 className="font-display mb-3 flex items-center gap-2 text-sm font-bold text-emerald-400">
                <Database className="h-4 w-4 text-emerald-400" />
                Supabase Relational Master Data Architecture
              </h3>
              <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
                  <div className="text-stone-300">
                    <strong>Project URL:</strong> <code className="font-mono text-emerald-400">https://zrazruytoqgmgqzdxxwy.supabase.co</code>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Direct Integration
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-stone-300">
                  <div className="rounded-xl border border-stone-800/80 bg-stone-950/70 p-3">
                    <div className="font-bold text-amber-300">cities</div>
                    <p className="mt-1 text-[11px] text-stone-400">
                      id, name, hindi_name, state, region, status, active_lines_count, total_stations_count, interchange_count, description, pdf_page
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-800/80 bg-stone-950/70 p-3">
                    <div className="font-bold text-amber-300">metro_lines</div>
                    <p className="mt-1 text-[11px] text-stone-400">
                      id, city_id, name, color_hex, text_color_hex, status, station_count, first_station, last_station
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-800/80 bg-stone-950/70 p-3">
                    <div className="font-bold text-amber-300">stations</div>
                    <p className="mt-1 text-[11px] text-stone-400">
                      id, city_id, line_id, name, station_number, is_interchange
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-800/80 bg-stone-950/70 p-3">
                    <div className="font-bold text-emerald-300">station_selections & community</div>
                    <p className="mt-1 text-[11px] text-stone-400">
                      id, created_at, visitor_token, city_name, station_name, user_name, is_public <br/>
                      <span className="text-emerald-400 font-medium">★ UNIQUE(visitor_token, city_name) + Public/Private visibility control</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columns Found Across Sheets */}
            <div>
              <h3 className="font-display mb-3 flex items-center gap-2 text-sm font-bold text-stone-100">
                <Table className="h-4 w-4 text-amber-400" />
                Columns Found in the Excel File
              </h3>
              <div className="space-y-3">
                {EXCEL_AUDIT_DATA.columnsFound.map((sheet, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4 text-xs"
                  >
                    <div className="font-display font-bold text-stone-200">
                      {sheet.sheetName}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {sheet.columns.map((col, cIdx) => (
                        <span
                          key={cIdx}
                          className="rounded-md border border-stone-800 bg-stone-900 px-2 py-1 font-mono text-[11px] text-amber-300"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duplication Audit Findings */}
            <div>
              <h3 className="font-display mb-3 flex items-center gap-2 text-sm font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Duplicate Data Audit Findings (Preserved as in Excel)
              </h3>
              <div className="space-y-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs">
                {EXCEL_AUDIT_DATA.duplicateDataNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-stone-300">
                    <span className="mt-0.5 text-amber-400">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Data Audit Findings */}
            <div>
              <h3 className="font-display mb-3 flex items-center gap-2 text-sm font-bold text-stone-300">
                <Info className="h-4 w-4 text-blue-400" />
                Missing Data & Structural Notes (No Silent Modifications)
              </h3>
              <div className="space-y-2 rounded-2xl border border-stone-800 bg-stone-950/70 p-4 text-xs">
                {EXCEL_AUDIT_DATA.missingDataNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-stone-400">
                    <span className="mt-0.5 text-stone-500">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
