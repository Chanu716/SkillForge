"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
    Database, 
    Table, 
    Network, 
    Zap, 
    Activity, 
    GitBranch, 
    Hash, 
    Search, 
    Workflow,
    ArrowRight,
    Trophy,
    XCircle,
    CheckCircle2
} from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD" | null;
type DBMSType = 'SCHEMA' | 'ER' | 'SQL' | 'JOIN' | 'NORM' | 'INDEX';

interface Level {
    id: number;
    title: string;
    type: DBMSType;
    question: string;
    visualData: any;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

const GENERATE_LEVELS = (diff: Difficulty, fixedType?: DBMSType): Level[] => {
    if (!diff) return [];
    
    return Array.from({ length: 15 }, (_, i) => {
        const id = i + 1;
        const seed = i;
        const types: DBMSType[] = ['SCHEMA', 'ER', 'SQL', 'JOIN', 'NORM', 'INDEX'];
        const type = fixedType || types[i % types.length];

        const SCHEMA_POOL = [
            { q: "Table [ID, Name, Date]. Best PK?", a: "ID (PK)", cols: ["ID", "Name", "Date"], opts: ["ID (PK)", "UserName", "CreationDate", "IP_Address"] },
            { q: "Table [Email, Pass, UID]. Best PK?", a: "UID", cols: ["Email", "Pass", "UID"], opts: ["UID", "UserEmail", "EncryptedPass", "LastLogin"] },
            { q: "Table [SSN, Name, City]. Most unique?", a: "SSN", cols: ["SSN", "Name", "City"], opts: ["SSN", "EmployeeName", "HomeCity", "Department"] },
            { q: "Table [ISBN, Title, Year]. Best PK?", a: "ISBN", cols: ["ISBN", "Title", "Year"], opts: ["ISBN", "BookTitle", "PubYear", "AuthorID"] },
            { q: "Table [VIN, Color, Model]. Best PK?", a: "VIN", cols: ["VIN", "Color", "Model"], opts: ["VIN", "CarColor", "CarModel", "RetailPrice"] },
            { q: "Table [MacAddress, User, IP]. Best identity?", a: "MacAddress", cols: ["MacAddress", "User", "IP"], opts: ["MacAddress", "Username", "IPAddress", "Subnet"] },
            { q: "Primary Key composed of multiple columns?", a: "Composite Key", cols: ["ColA", "ColB", "Key"], opts: ["Composite Key", "Foreign Key", "Super Key", "Candidate Key"] },
            { q: "Constraint that prevents NULL in PK?", a: "NOT NULL", cols: ["ID", "Val", "NullCheck"], opts: ["NOT NULL", "UNIQUE", "DEFAULT", "CHECK"] },
            { q: "Link to PK in another table?", a: "Foreign Key", cols: ["ID", "Data", "RefID"], opts: ["Foreign Key", "Primary Key", "Unique Key", "Proxy Key"] },
            { q: "Auto-generated ID type?", a: "Surrogate Key", cols: ["ID_Inc", "Data", "Meta"], opts: ["Surrogate Key", "Natural Key", "Foreign Key", "Index Key"] },
            { q: "Best PK for global uniqueness?", a: "UUID", cols: ["UUID", "Name", "Time"], opts: ["UUID", "Auto-increment", "Timestamp", "Static String"] },
            { q: "Attribute used for fast lookups?", a: "Index", cols: ["ID", "SearchCol", "Tag"], opts: ["Index", "Primary Key", "Foreign Key", "Trigger"] },
            { q: "Key based on real-world data?", a: "Natural Key", cols: ["Email", "Phone", "SSN"], opts: ["Natural Key", "Surrogate Key", "Unique Key", "Artificial Key"] },
            { q: "Minimal set of ID attributes?", a: "Candidate Key", cols: ["A", "B", "C"], opts: ["Candidate Key", "Super Key", "Primary Key", "Foreign Key"] },
            { q: "Set of attributes defining row?", a: "Superkey", cols: ["ID", "All", "Set"], opts: ["Superkey", "Candidate Key", "Primary Key", "Unique Key"] }
        ];

        const ER_POOL = [
            { q: "Dept has many Employees, Employee has one Dept. Type?", a: "1:N", nodes: ["Dept", "Emp"], link: "1:N", opts: ["1:N", "1:1", "N:M", "Recursive"] },
            { q: "Author writes many Books, Book has many Authors. Type?", a: "N:M", nodes: ["Author", "Book"], link: "N:M", opts: ["N:M", "1:N", "1:1", "Binary"] },
            { q: "Person has one Passport, Passport belongs to one Person. Type?", a: "1:1", nodes: ["Person", "Pass"], link: "1:1", opts: ["1:1", "1:N", "N:M", "Unary"] },
            { q: "Student takes many Courses, Course has many Students. Type?", a: "N:M", nodes: ["Student", "Course"], link: "N:M", opts: ["N:M", "1:N", "1:1", "N:1"] },
            { q: "Company has many Cars, Car used by one Company. Type?", a: "1:N", nodes: ["Company", "Car"], link: "1:N", opts: ["1:N", "1:1", "N:M", "M:1"] },
            { q: "Entity that cannot exist without an owner?", a: "Weak Entity", nodes: ["Building", "Room"], link: "Owns", opts: ["Weak Entity", "Strong Entity", "Simple Entity", "Relational Entity"] },
            { q: "Recursive supervisor relationship is a _____", a: "Self Link", nodes: ["Staff", "Staff"], link: "Manages", opts: ["Self Link", "Binary Link", "Ternary Link", "Unary Link"] },
            { q: "Relationship involving 3 entities?", a: "Ternary", nodes: ["E1", "E2"], link: "E3 Link", opts: ["Ternary", "Binary", "Unary", "N-ary"] },
            { q: "Each User has one Profile. Relationship?", a: "1:1", nodes: ["User", "Profile"], link: "1:1", opts: ["1:1", "1:N", "N:M", "None"] },
            { q: "Many Students in many Project Teams. Relationship?", a: "M:N", nodes: ["Student", "Project"], link: "M:N", opts: ["M:N", "1:N", "1:1", "Binary"] },
            { q: "A Product has multiple Reviews. Relation?", a: "1:N", nodes: ["Product", "Review"], link: "1:N", opts: ["1:N", "1:1", "N:M", "M:1"] },
            { q: "Course is dependent on Department. Entity status?", a: "Weak", nodes: ["Dept", "Course"], link: "Has", opts: ["Weak", "Strong", "Partial", "Total"] },
            { q: "Relationship between same entity set?", a: "Recursive", nodes: ["Emp", "Manager"], link: "Self", opts: ["Recursive", "Symmetric", "Transitive", "Equivalence"] },
            { q: "Card in ER representing multi-values?", a: "Double Oval", nodes: ["E1", "E2"], link: "Degree", opts: ["Double Oval", "Single Oval", "Rectangle", "Diamond"] },
            { q: "Attributes calculated from others are?", a: "Derived", nodes: ["DOB", "Age"], link: "Calc", opts: ["Derived", "Composite", "Multi-valued", "Simple"] }
        ];

        const SQL_POOL = [
            { q: "Retrieve all columns from Users?", a: "SELECT *", query: "SELECT * FROM Users", condition: "All columns", opts: ["SELECT *", "GET ALL", "FETCH DATA", "RETRIEVE *"] },
            { q: "Filter Users where age is 25?", a: "WHERE Age=25", query: "SELECT * FROM Users...", condition: "Age = 25", opts: ["WHERE Age=25", "IF Age=25", "HAVING Age=25", "Age IS 25"] },
            { q: "Sort results by Salary?", a: "ORDER BY", query: "SELECT * FROM Staff...", condition: "Salary DESC", opts: ["ORDER BY", "SORT BY", "GROUP BY", "ALIGN BY"] },
            { q: "Get average Salary per Dept?", a: "GROUP BY", query: "SELECT AVG(Salary)...", condition: "DeptID", opts: ["GROUP BY", "ORDER BY", "HAVING", "CLUSTER BY"] },
            { q: "Filter groups with high average?", a: "HAVING", query: "SELECT AVG(Salary)...", condition: "AVG > 5000", opts: ["HAVING", "WHERE", "GROUP BY", "FILTER BY"] },
            { q: "Combine Left and Right tables?", a: "JOIN", query: "A JOIN B ON A.id = B.id", condition: "Intersection", opts: ["JOIN", "UNION", "MERGE", "APPEND"] },
            { q: "Limited result set to top 10?", a: "LIMIT 10", query: "SELECT * FROM Logs...", condition: "Page 1", opts: ["LIMIT 10", "COUNT 10", "TOP 10", "STOP 10"] },
            { q: "Find null values in Email?", a: "IS NULL", query: "SELECT * FROM Users...", condition: "Email IS NULL", opts: ["IS NULL", "= NULL", "IS EMPTY", "NOT EXISTS"] },
            { q: "Match patterns like 'A%'?", a: "LIKE", query: "SELECT * FROM Names...", condition: "Name LIKE 'A%'", opts: ["LIKE", "MATCH", "CONTAINS", "SIMILAR"] },
            { q: "Check if value in [1,2,3]?", a: "IN", query: "SELECT * FROM IDs...", condition: "ID IN (...)", opts: ["IN", "BETWEEN", "AMONG", "WITHIN"] },
            { q: "Value between 10 and 20?", a: "BETWEEN", query: "SELECT * FROM Stats...", condition: "Val 10-20", opts: ["BETWEEN", "WITHIN", "IN", "RANGE"] },
            { q: "Add new record to table?", a: "INSERT", query: "INSERT INTO Users...", condition: "New Row", opts: ["INSERT", "ADD", "UPDATE", "APPEND"] },
            { q: "Modify existing record?", a: "UPDATE", query: "UPDATE Users SET...", condition: "State Change", opts: ["UPDATE", "CHANGE", "MODIFY", "ALTER"] },
            { q: "Delete all rows efficiently?", a: "TRUNCATE", query: "TRUNCATE TABLE Logs", condition: "Fast Clear", opts: ["TRUNCATE", "DELETE ALL", "DROP", "CLEAR"] },
            { q: "Remove table structure?", a: "DROP", query: "DROP TABLE Temp", condition: "Delete Entirely", opts: ["DROP", "DELETE", "TRUNCATE", "REMOVE"] }
        ];

        const JOIN_POOL = [
            { q: "Intersection of both tables?", a: "INNER JOIN (FIXED)", left: 10, right: 10, type: "INNER", opts: ["INNER JOIN (FIXED)", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"] },
            { q: "All Left + Matching Right?", a: "LEFT JOIN", left: 10, right: 5, type: "LEFT", opts: ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "CROSS JOIN"] },
            { q: "All Right + Matching Left?", a: "RIGHT JOIN", left: 5, right: 10, type: "RIGHT", opts: ["RIGHT JOIN", "LEFT JOIN", "INNER JOIN", "FULL JOIN"] },
            { q: "Cartesian product of tables?", a: "CROSS JOIN", left: 10, right: 10, type: "CROSS", opts: ["CROSS JOIN", "INNER JOIN", "UNION", "NATURAL JOIN"] },
            { q: "Combine everything, both sides?", a: "FULL OUTER JOIN", left: 10, right: 10, type: "FULL", opts: ["FULL OUTER JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN"] },
            { q: "Table matched with itself?", a: "SELF JOIN", left: 10, right: 10, type: "SELF", opts: ["SELF JOIN", "INNER JOIN", "CROSS JOIN", "RECURSIVE JOIN"] },
            { q: "Join with no intersection key?", a: "CROSS JOIN", left: 5, right: 5, type: "CROSS", opts: ["CROSS JOIN", "NATURAL JOIN", "INNER JOIN", "LEFT JOIN"] },
            { q: "Natural Join uses columns with?", a: "Same Name", left: 10, right: 10, type: "NATURAL", opts: ["Same Name", "Same Type", "Foreign Keys", "Primary Keys"] },
            { q: "Left 10, Right 0 matches. LEFT results?", a: "10", left: 10, right: 0, type: "LEFT", opts: ["10", "0", "None", "Null Values"] },
            { q: "Merging results vertically?", a: "UNION", left: 10, right: 10, type: "UNION", opts: ["UNION", "COMPUTE", "INTERSECT", "EXCEPT"] },
            { q: "Removing duplicates from Union?", a: "UNION", left: 10, right: 10, type: "UNION", opts: ["UNION", "UNION ALL", "DISTINCT JOIN", "MINUS SET"] },
            { q: "Keeping duplicates in Union?", a: "UNION ALL", left: 10, right: 10, type: "UNION", opts: ["UNION ALL", "UNION", "MERGE JOIN", "APPEND"] },
            { q: "Rows not matched in Inner Join?", a: "Discarded", left: 10, right: 10, type: "INNER", opts: ["Discarded", "NULL values", "Kept in result", "Shadowed"] },
            { q: "Alias used to simplify?", a: "Table Alias", left: 10, right: 10, type: "ALIAS", opts: ["Table Alias", "Column Proxy", "Subtitle", "Pointer"] },
            { q: "Keyword to define Join key?", a: "ON", left: 10, right: 10, type: "ON", opts: ["ON", "USING", "WHERE", "CONNECT"] }
        ];

        const NORM_POOL = [
            { q: "Rule: Atomicity of cells?", a: "1NF", table: "Atomic", data: "Data Cells", opts: ["1NF", "2NF", "3NF", "BCNF"] },
            { q: "Rule: No partial dependencies?", a: "2NF", table: "KeyDeps", data: "PK Partials", opts: ["2NF", "1NF", "3NF", "4NF"] },
            { q: "Rule: No transitive dependencies?", a: "3NF", table: "Trans", data: "Non-prime links", opts: ["3NF", "2NF", "BCNF", "5NF"] },
            { q: "Strict 3NF where every determinant is a key?", a: "BCNF", table: "Determinant", data: "Strict Key", opts: ["BCNF", "3NF", "4NF", "DKNF"] },
            { q: "Table with list of roles violates?", a: "1NF", table: "Users", data: "Roles: [A,B,C]", opts: ["1NF", "2NF", "3NF", "0NF"] },
            { q: "Norm form for composite key issues only?", a: "2NF", table: "Comp", data: "Part-Key Link", opts: ["2NF", "3NF", "BCNF", "1NF"] },
            { q: "Normalization reduces _____?", a: "Redundancy", table: "Storage", data: "Duplicate Rows", opts: ["Redundancy", "Performance", "Security", "Reliability"] },
            { q: "Process of splitting tables?", a: "Decomposition", table: "Base", data: "Base -> T1, T2", opts: ["Decomposition", "Normalization", "Refactoring", "Partitioning"] },
            { q: "Merging for performance?", a: "Denormalization", table: "Speed", data: "T1+T2 -> Table", opts: ["Denormalization", "Optimization", "Aggregation", "Indexing"] },
            { q: "Attribute belonging to a candidate key?", a: "Prime Attribute", table: "Attrib", data: "Part of PK", opts: ["Prime Attribute", "Foreign Attribute", "Derived Attribute", "Composite Attribute"] },
            { q: "Non-prime depends on PK?", a: "Fully Functional", table: "Rel", data: "A -> B", opts: ["Fully Functional", "Partial", "Transitive", "Trivial"] },
            { q: "Transitive chain: A -> B -> C?", a: "3NF Violation", table: "Chain", data: "C depends on B", opts: ["3NF Violation", "2NF Violation", "BCNF Violation", "1NF Violation"] },
            { q: "Normal form for Join dependency?", a: "5NF", table: "Joins", data: "Multi-table merge", opts: ["5NF", "4NF", "BCNF", "3NF"] },
            { q: "Table in 2NF if no _____ deps?", a: "Partial", table: "Logic", data: "Key Part -> Col", opts: ["Partial", "Transitive", "Full", "Trivial"] },
            { q: "Candidate key is {A, B}. A -> C violates?", a: "2NF", table: "Logic", data: "Partial Dependency", opts: ["2NF", "3NF", "BCNF", "1NF"] }
        ];

        const INDEX_POOL = [
            { q: "B+ Tree root to leaf search complexity?", a: "O(log N)", levels: 3, opts: ["O(log N)", "O(1)", "O(N)", "O(N^2)"] },
            { q: "Index that sorts disk data?", a: "Clustered", levels: 2, opts: ["Clustered", "Non-clustered", "Unique", "Bitmap"] },
            { q: "Physical order of data rows determined by?", a: "Clustered Index", levels: 4, opts: ["Clustered Index", "Non-clustered Index", "Primary Key", "Heap"] },
            { q: "Stored separately from data rows?", a: "Non-clustered", levels: 3, opts: ["Non-clustered", "Clustered", "Direct", "Linear"] },
            { q: "How many clustered indexes per table?", a: "1", levels: 1, opts: ["1", "Unlimited", "0", "2"] },
            { q: "Speeds up SELECT at cost of?", a: "INSERT/UPDATE", levels: 5, opts: ["INSERT/UPDATE", "DELETE", "STORAGE", "CPU"] },
            { q: "Index on multiple columns?", a: "Composite Index", levels: 3, opts: ["Composite Index", "Simple Index", "Multi-index", "Shadow Index"] },
            { q: "Index entry points to?", a: "Data Block", levels: 2, opts: ["Data Block", "Memory Pointer", "Next Node", "Null"] },
            { q: "B+ Tree fan-out refers to?", a: "Max Pointers per Node", levels: 4, opts: ["Max Pointers per Node", "Tree Height", "Leaf Count", "Root Strategy"] },
            { q: "Index rebuild is needed for?", a: "Fragmentation", levels: 3, opts: ["Fragmentation", "Query Tuning", "Data Encryption", "Schema Change"] },
            { q: "Unique constraint creates a/an?", a: "Unique Index", levels: 2, opts: ["Unique Index", "Composite Index", "Bitmap Index", "Full-text Index"] },
            { q: "Bitmap index is used for?", a: "Low Cardinality Columns", levels: 1, opts: ["Low Cardinality Columns", "Primary Keys", "Unique Values", "Large Blobs"] },
            { q: "Inverted index is for?", a: "Full-text Search", levels: 4, opts: ["Full-text Search", "Exact Matches", "Range Scans", "Sorting"] },
            { q: "Fastest index for exact match?", a: "Hash Index", levels: 1, opts: ["Hash Index", "B-Tree Index", "Clustered Index", "Bitmap Index"] },
            { q: "Balanced tree maintains?", a: "Sorted Order", levels: 3, opts: ["Sorted Order", "Search History", "Permission Mask", "Log Pointers"] }
        ];

        const getPool = (t: DBMSType) => {
            switch(t) {
                case 'SCHEMA': return SCHEMA_POOL;
                case 'ER': return ER_POOL;
                case 'SQL': return SQL_POOL;
                case 'JOIN': return JOIN_POOL;
                case 'NORM': return NORM_POOL;
                case 'INDEX': return INDEX_POOL;
            }
        };

        const pool = getPool(type);
        const data = pool[seed % pool.length] as any;

        return {
            id,
            type,
            title: `${type} Analysis ${id}`,
            question: data.q,
            visualData: data,
            options: [...data.opts].sort(() => Math.random() - 0.5),
            correctAnswer: data.a,
            explanation: `Neural analysis identifies ${data.a} as the statistically correct resolution for this Relational ${type} predicate.`
        };
    });
};

export default function DBMSSimulator({ forcedType, onComplete }: { forcedType?: DBMSType, onComplete: (score: number) => void }) {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<"SUCCESS" | "ERROR" | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const levels = useMemo(() => GENERATE_LEVELS(difficulty, forcedType), [difficulty, forcedType]);
    const level = levels[currentIdx];

    const handleCheck = (val: string) => {
        if (feedback) return;
        setSelected(val);
        if (val === level.correctAnswer) setFeedback("SUCCESS");
        else setFeedback("ERROR");
    };

    const nextLevel = () => {
        if (currentIdx < levels.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelected(null);
            setFeedback(null);
        } else {
            setIsFinished(true);
            onComplete(100);
        }
    };

    if (!difficulty) {
        return (
            <div className="w-full max-w-4xl mx-auto py-20 px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <Database className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tighter uppercase">Query Engine</h1>
                    <p className="text-primary/60 font-mono tracking-widest uppercase italic">Master the architecture of persistent memory systems.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {["EASY", "MEDIUM", "HARD"].map((d, i) => (
                        <motion.button
                            key={d}
                            whileHover={{ y: -10, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setDifficulty(d as Difficulty)}
                            className="p-10 rounded-[40px] border-2 border-white/5 bg-white/5 hover:border-primary/50 transition-all flex flex-col items-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {i === 0 ? <Zap className="w-12 h-12 mb-6 text-primary" /> : 
                             i === 1 ? <GitBranch className="w-12 h-12 mb-6 text-primary" /> : 
                             <Workflow className="w-12 h-12 mb-6 text-primary" />}
                            <h3 className="text-2xl font-black text-white uppercase">{d}</h3>
                            <p className="text-xs text-white/40 mt-2 font-mono">NODE_INIT_{d}</p>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="text-center p-20 flex flex-col items-center gap-8">
                <Trophy className="w-32 h-32 text-yellow-500 animate-bounce" />
                <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter">Engine Synchronized</h1>
                <p className="text-primary/60 font-mono tracking-widest">Database protocols fully optimized.</p>
                <Button onClick={() => window.location.reload()} size="xl" className="rounded-full px-12 h-16 text-xl">Return to Hub</Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            {/* Neural Header */}
            <div className="flex justify-between items-start px-4 mb-4">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl border-2 border-primary/30 bg-primary/10 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                        <Activity className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-3">
                            <span className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em]">Protocol:</span>
                            <span className="text-xl font-black text-white uppercase tracking-[0.2em]">{difficulty}</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Database Neural Link</p>
                        
                        <div className="flex gap-2 pt-4">
                            {levels.map((_, i) => (
                                <motion.div 
                                    key={i}
                                    initial={false}
                                    animate={{ 
                                        backgroundColor: i <= currentIdx ? "rgba(34, 197, 94, 1)" : "rgba(255, 255, 255, 0.1)",
                                        width: i === currentIdx ? 48 : 24
                                    }}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-500",
                                        i === currentIdx && "shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => setDifficulty(null)} 
                    className="text-[10px] font-mono opacity-40 hover:opacity-100 mt-2 tracking-widest"
                >
                    ABORT_QUERY
                </Button>
            </div>

            <div className="bg-black/20 border-2 border-white/10 rounded-[50px] p-4 min-h-[180px] flex flex-col items-center justify-center relative backdrop-blur-md overflow-hidden">
                <AnimatePresence mode="wait">
                    {feedback === "ERROR" ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center text-center p-4 max-w-2xl"
                        >
                            <XCircle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
                            <h2 className="text-3xl font-black text-red-500 mb-4 uppercase tracking-tighter italic">Integrity Violation</h2>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-4 mb-4 backdrop-blur-xl">
                                <p className="text-lg text-white/90 font-medium italic">🧐 {level.explanation}</p>
                            </div>
                            <Button onClick={nextLevel} size="xl" className="rounded-full px-16 h-20 text-xl bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]">Fix Stream</Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="question"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full flex flex-col items-center gap-12"
                        >
                            {/* Visual Engine Display */}
                            <div className="relative w-full max-w-2xl aspect-video bg-black/40 rounded-[40px] border-4 border-white/5 flex items-center justify-center p-4">
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                    <Database className="w-64 h-64 text-primary" />
                                </div>
                                
                                {level.type === 'SCHEMA' && (
                                    <div className="grid grid-cols-2 gap-4 w-full h-full content-center">
                                        {level.visualData.cols.map((col: string, idx: number) => (
                                            <motion.div 
                                                key={idx}
                                                whileHover={{ scale: 1.05 }}
                                                className={cn(
                                                    "p-3 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300",
                                                    col === "UserID" ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)]" : "border-white/10 bg-white/5"
                                                )}
                                            >
                                                <Hash className="w-5 h-5 opacity-40" />
                                                <span className="font-mono font-bold text-white uppercase tracking-wider">{col}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {level.type === 'ER' && (
                                    <div className="flex items-center gap-12 w-full justify-center">
                                        <div className="p-4 rounded-3xl bg-primary/20 border-2 border-primary text-white font-black text-lg shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                                            {level.visualData.nodes[0]}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary opacity-50 relative">
                                                <motion.div 
                                                    animate={{ left: ["0%", "100%"] }} 
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full blur-md"
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-primary mt-2">{level.visualData.link}</span>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-white/10 border-2 border-white/20 text-white font-black text-lg">
                                            {level.visualData.nodes[1]}
                                        </div>
                                    </div>
                                )}

                                {level.type === 'SQL' && (
                                    <div className="w-full flex flex-col gap-6">
                                        <code className="p-4 bg-black/60 rounded-3xl border border-primary/30 text-primary font-mono text-lg block leading-relaxed">
                                            <span className="text-white/40 italic">-- Executing Thread --</span><br/>
                                            {level.visualData.query}
                                        </code>
                                        <div className="flex gap-4">
                                            <div className="flex-1 p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                                                <Activity className="w-6 h-6 text-primary" />
                                                <span className="text-sm font-mono text-white/60 uppercase">Filter: {level.visualData.condition}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {level.type === 'JOIN' && (
                                    <div className="flex items-center gap-4 w-full h-full px-12">
                                        <div className="flex-1 h-32 bg-primary/20 border-2 border-primary rounded-3xl flex items-center justify-center font-black text-2xl relative shadow-[0_0_40px_rgba(var(--primary),0.25)]">
                                            <Table className="absolute -top-4 -left-4 w-8 h-8 text-primary opacity-40" />
                                            A [{level.visualData.a}]
                                        </div>
                                        <Network className="w-12 h-12 text-primary animate-pulse" />
                                        <div className="flex-1 h-32 bg-white/10 border-2 border-white/20 rounded-3xl flex items-center justify-center font-black text-2xl relative opacity-40">
                                            B [{level.visualData.b}]
                                        </div>
                                    </div>
                                )}

                                {level.type === 'NORM' && (
                                    <div className="w-full flex flex-col gap-4">
                                        <h4 className="text-xs font-mono text-primary uppercase tracking-[0.4em] text-center mb-4 italic">Decomposition Required</h4>
                                        <div className="p-8 bg-white/5 rounded-3xl border-2 border-red-500/30 flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/40">
                                                    <Zap className="w-6 h-6 text-red-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-white font-black text-xl uppercase tracking-tighter italic">Table_{level.visualData.table}</p>
                                                    <p className="text-sm text-white/40 font-mono tracking-widest uppercase">{level.visualData.data}</p>
                                                </div>
                                            </div>
                                            <Workflow className="w-8 h-8 text-white/10 group-hover:text-red-500 transition-colors" />
                                        </div>
                                    </div>
                                )}

                                {level.type === 'INDEX' && (
                                    <div className="flex flex-col items-center gap-8 w-full">
                                        <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary),0.3)]">
                                            <Search className="w-10 h-10 text-primary" />
                                        </div>
                                        <div className="flex gap-4">
                                            {[...Array(level.visualData.levels)].map((_, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-2">
                                                    <div className="w-4 h-16 bg-gradient-to-b from-primary to-transparent opacity-40 rounded-full" />
                                                    <span className="text-[10px] font-mono text-white/40">LVL_{idx + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 w-full max-w-2xl">
                                <h3 className="text-2xl font-black text-white text-center leading-relaxed italic tracking-tight">{level.question}</h3>
                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    {level.options.map((opt, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.03, y: -5 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleCheck(opt)}
                                            className={cn(
                                                "p-4 rounded-[35px] border-2 transition-all font-black text-lg uppercase tracking-tighter italic min-h-[80px]",
                                                selected === opt 
                                                    ? (opt === level.correctAnswer ? "border-green-500 bg-green-500/20 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]" : "border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]")
                                                    : "border-white/10 bg-white/5 text-white/80 hover:border-primary/50 hover:bg-primary/5"
                                            )}
                                        >
                                            {opt}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Success Micro-Animation */}
            <AnimatePresence>
                {feedback === "SUCCESS" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -50 }}
                        className="flex flex-col items-center gap-8 py-10"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-green-500/20 p-8 rounded-full border-4 border-green-500 shadow-[0_0_100px_rgba(34,197,94,0.4)]"
                        >
                            <CheckCircle2 className="w-24 h-24 text-green-500" />
                        </motion.div>
                        <p className="text-4xl font-black text-green-500 uppercase tracking-[0.5em] italic animate-pulse">
                            Query Validated
                        </p>
                        <Button 
                            onClick={nextLevel} 
                            size="xl" 
                            className="bg-primary hover:bg-primary/80 text-white px-32 py-12 rounded-full text-3xl font-black shadow-[0_30px_80px_rgba(var(--primary),0.4)] hover:shadow-primary/60 transition-all uppercase italic tracking-tighter"
                        >
                            Next Thread 🚀
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}