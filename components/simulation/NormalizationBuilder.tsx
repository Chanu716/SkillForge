"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Split, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column {
    id: string;
    name: string;
    data: string[];
    isKey?: boolean;
}

export default function NormalizationBuilder({ onComplete }: { onComplete: (score: number) => void }) {
    // Scenario: Unnormalized table with repeating groups needing split
    const [columns, setColumns] = useState<Column[]>([
        { id: "col-1", name: "StudentID", data: ["101", "101", "102"], isKey: true },
        { id: "col-2", name: "StudentName", data: ["Alice", "Alice", "Bob"] },
        { id: "col-3", name: "CourseID", data: ["CS101", "CS102", "CS101"], isKey: true }, // Composite candidate
        { id: "col-4", name: "CourseName", data: ["Intro to CS", "Data Struct", "Intro to CS"] },
        { id: "col-5", name: "Instructor", data: ["Dr. Smith", "Dr. Jones", "Dr. Smith"] },
    ]);

    const [table2Cols, setTable2Cols] = useState<Column[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);

    const moveColumn = (colId: string, toTable2: boolean) => {
        setFeedback(null);
        if (toTable2) {
            const col = columns.find(c => c.id === colId);
            if (col) {
                setColumns(prev => prev.filter(c => c.id !== colId));
                setTable2Cols(prev => [...prev, col]);
            }
        } else {
            const col = table2Cols.find(c => c.id === colId);
            if (col) {
                setTable2Cols(prev => prev.filter(c => c.id !== colId));
                setColumns(prev => [...prev, col]);
            }
        }
    };

    const validate = () => {
        // Correct solution: 
        // Table 1: StudentID, StudentName
        // Table 2: CourseID, CourseName, Instructor
        // OR similar valid splits. 
        // Simplified logic: Check if Course-related fields are separated from Student-related fields, or if we have a valid decomposition.

        // Check if Table 2 has CourseID and CourseName/Instructor
        const t2Ids = table2Cols.map(c => c.id);
        const hasCourseDetails = t2Ids.includes("col-3") && (t2Ids.includes("col-4") || t2Ids.includes("col-5"));
        const t1Ids = columns.map(c => c.id);
        const hasStudentDetails = t1Ids.includes("col-1") && t1Ids.includes("col-2");

        if (hasCourseDetails && hasStudentDetails && (t1Ids.length + t2Ids.length === 5)) {
            setFeedback("SUCCESS");
            onComplete(100);
        } else {
            setFeedback("INCOMPLETE DECOMPOSITION");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-2 font-display">Normalization Engine</h2>
                <p className="text-muted-foreground">
                    Detected <span className="text-red-400">Redundancy</span> in Dataset. Decompose into <span className="text-primary">3NF</span>.
                </p>
            </div>

            <div className="flex gap-8 items-start justify-center">
                {/* Table 1 */}
                <div className="flex-1 bg-card/10 border border-white/10 rounded-xl p-4 min-h-[300px]">
                    <div className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">Primary Relation</div>
                    <div className="flex gap-2 bg-black/20 p-2 rounded overflow-x-auto">
                        {columns.map(col => (
                            <ColumnCard key={col.id} column={col} onClick={() => moveColumn(col.id, true)} />
                        ))}
                        {columns.length === 0 && <div className="text-xs text-muted-foreground p-4">Empty Relation</div>}
                    </div>

                    {/* Data Preview */}
                    <div className="mt-4 space-y-1 opacity-50">
                        {[0, 1, 2].map(rowIdx => (
                            <div key={rowIdx} className="flex gap-2">
                                {columns.map(col => (
                                    <div key={col.id} className="w-24 text-xs p-1 border border-white/5 truncate">{col.data[rowIdx]}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Area */}
                <div className="flex flex-col items-center justify-center pt-20 gap-4">
                    <Split className="w-8 h-8 text-muted-foreground" />
                    <Button onClick={validate} size="lg" className={cn(feedback === 'SUCCESS' ? "bg-green-600 hover:bg-green-700" : "")}>
                        {feedback === 'SUCCESS' ? "Normalized" : "Validate Split"}
                    </Button>
                </div>

                {/* Table 2 */}
                <div className="flex-1 bg-card/10 border border-dashed border-white/20 rounded-xl p-4 min-h-[300px]">
                    <div className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">New Relation</div>
                    <div className="flex gap-2 bg-black/20 p-2 rounded overflow-x-auto min-h-[100px]">
                        {table2Cols.map(col => (
                            <ColumnCard key={col.id} column={col} onClick={() => moveColumn(col.id, false)} />
                        ))}
                        {table2Cols.length === 0 && <div className="text-xs text-muted-foreground p-4 w-full text-center">Drag Columns Here</div>}
                    </div>
                </div>
            </div>

            {feedback && feedback !== 'SUCCESS' && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-8 text-center text-red-400 font-mono"
                >
                    ERROR: {feedback}
                </motion.div>
            )}
        </div>
    );
}

function ColumnCard({ column, onClick }: { column: Column, onClick: () => void }) {
    return (
        <motion.div
            layoutId={column.id}
            onClick={onClick}
            className={cn(
                "w-24 flex-shrink-0 bg-card border p-3 rounded cursor-pointer hover:border-primary transition-colors group",
                column.isKey ? "border-yellow-500/50" : "border-white/10"
            )}
        >
            <div className="flex items-center gap-1 mb-2">
                {column.isKey && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
                <div className="font-bold text-xs truncate" title={column.name}>{column.name}</div>
            </div>
            <div className="h-1 w-full bg-white/5 rounded overflow-hidden group-hover:bg-primary/20">
                <div className="h-full bg-white/20 w-3/4" />
            </div>
        </motion.div>
    )
}
