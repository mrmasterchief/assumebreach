"use client";
import React, { useEffect, useState } from "react";
import { showMessage } from "@/components/messages/Message";
import LinearProgress from "@mui/material/LinearProgress";
import { getFlagsList, submitFlag } from "@/hooks/ctf";
import Link from "next/link";
import NestedList from "@/components/list/NestedList";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { indexFunction } from "@/hooks";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { db } from "@/firebase/config";
import { onSnapshot, doc, setDoc, getDoc, collection } from "firebase/firestore";
import { getUserInfo } from "@/hooks/user";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion, AnimatePresence } from "framer-motion";

export default function ScoreBoard() {
  const [score, setScore] = useState<number>(0);
  const [flagInput, setFlagInput] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [liveScoreBoard, setLiveScoreBoard] = useState<
    {
      name: string;
      score: number;
    }[]
  >([]);



  interface Flag {
    title: string;
    collected: boolean;
    description: string;
    hint: string;
    difficulty: "Easy" | "Medium" | "Hard";
    securityCategory:
    | "IDOR"
    | "XSS"
    | "SQL Injection"
    | "Insecure API"
    | "Broken Access Control";
    youtubeExplainer: string;
    secureCodeID: number;
  }

  const [flagList, setFlagList] = useState<Flag[]>([]);
  const [flagCorrect, setFlagCorrect] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<
    "difficulty" | "collected"
  >("difficulty");
  const [unsafeID, setUnsafeID] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("flags");
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(flagList.length / pageSize);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const tabs = [
    { id: 0, label: "Flags", icon: "material-symbols:flag" },
    { id: 1, label: "Scoreboard", icon: "material-symbols:leaderboard" },
  ];

  useEffect(() => {
    const fetchUnsafeID = async () => {
      if (!unsafeID) {
        const storedID = localStorage.getItem("unsafeID");
        setUnsafeID(storedID);
      }
    };

    const fetchFlags = async () => {
      if (!unsafeID) return;

      try {
        await indexFunction(
          [() => getFlagsList({ unsafeID: unsafeID }),
          () => getUserInfo({ unsafeID: unsafeID })],
          async ([flagsResult, userResults]) => {
            if (!flagsResult || !userResults) {
              showMessage("Error", "No flags found", "error");
              return;
            }
            setFullName(userResults.user.full_name);
            setFlagList(flagsResult.flags);
            setScore(flagsResult.score);
            await updateFireStore({
              unsafeID: unsafeID,
              fullName: userResults.user.full_name,
              score: flagsResult.score,
            });
          },
          true
        );
      } catch (e) {
        console.error(e);
      }
    };

    fetchUnsafeID();
    fetchFlags();
  }, [flagCorrect, unsafeID]);

  const handleFlagSubmit = async () => {
    if (!flagInput) return;
    try {
      await indexFunction(
        [() => submitFlag({ unsafeID: unsafeID || "", flag: flagInput })],
        async () => {
          setFlagCorrect(true);
          await updateFireStore({
            unsafeID: unsafeID,
            fullName: fullName,
            score: score,
          });
          setFlagInput("");
          showMessage("Success", "You have collected a flag", "success");
        },
        true
      );
    } catch (e) {
      console.error(e);
      showMessage(
        "Error",
        "You have already collected this flag or this flag is not valid.",
        "error"
      );
    }
  };
  const sortFlagsList = ({
    sortByOption,
  }: {
    sortByOption: "difficulty" | "collected" | "securityCategory";
  }) => {
    const sortedList = [...flagList].sort((a, b) => {
      if (sortByOption === "difficulty") {
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      } else if (sortByOption === "collected") {
        return a.collected === b.collected ? 0 : a.collected ? -1 : 1;
      } else if (sortByOption === "securityCategory") {
        const categoryOrder = {
          IDOR: 1,
          XSS: 2,
          "SQL Injection": 3,
          "Insecure API": 4,
          "Broken Access Control": 5,
        };
        return (
          categoryOrder[a.securityCategory] - categoryOrder[b.securityCategory]
        );
      }
      return 0;
    });
    setFlagList(sortedList);
  };

  const updateFireStore = async ({
    unsafeID,
    fullName,
    score
  }: {
    unsafeID: string | null;
    fullName: string;
    score: number;
  }) => {
    if (!unsafeID || !fullName) return;
    const docRef = doc(db, "ctf", unsafeID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setScore(data.score);
    } else {
      setDoc(
        doc(db, "ctf", unsafeID),
        {
          score: score,
          name: fullName,
        },
        { merge: true }
      );
    }
  }

  useEffect(() => {
    if (!unsafeID || fullName) return;
    const unsubscribe = onSnapshot(
      collection(db, "ctf"),
      (snapshot) => {
        const data: {
          name: string;
          score: number;
        }[] = [];
        snapshot.forEach((doc) => {
          data.push(doc.data() as { name: string; score: number });
        });
        data.sort((a, b) => b.score - a.score);
        setLiveScoreBoard(data);
      },
      (error) => {
        console.error("Error fetching live scoreboard:", error);
      }
    );
    return () => {
      unsubscribe();
    }

  }, [unsafeID]);




  const Filters = () => {
    return (
      <FormControl fullWidth>
        <InputLabel id="sort-by-label">Sort By</InputLabel>
        <Select
          labelId="sort-by-label"
          id="sort-by-select"
          value={sortBy}
          label="Sort By"
          onChange={(event: SelectChangeEvent) => {
            setSortBy(
              event.target.value as
              | "difficulty"
              | "collected"
            );
            sortFlagsList({
              sortByOption: event.target.value as
                | "difficulty"
                | "collected"
            });
          }}
        >
          <MenuItem value="difficulty">Difficulty</MenuItem>
          <MenuItem value="collected">Collected</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const FlagsList = ({
    flags,
  }: {
    flags: Flag[];
  }) => {

    return flags.map((flag, index) => (
      <NestedList
        key={index}
        title={flag.title}
        collected={flag.collected}
        description={flag.description}
        hint={flag.hint}
        difficulty={flag.difficulty}
        securityCategory={flag.securityCategory}
        youtubeExplainer={flag.youtubeExplainer}
        secureCodeID={flag.secureCodeID}
      />
    ));
  };

  const FlagsByCategory = ({
    category,
  }: {
    category: "Easy" | "Medium" | "Hard";
  }) => {
    const filteredFlags = flagList.filter((flag) => flag.difficulty === category);
    const collectedCount = filteredFlags.filter((flag) => flag.collected).length;
    const totalCount = filteredFlags.length;

    if (totalCount === 0) {
      return (
        <div className="bg-gray-100 w-full mx-2 aspect-[3/1] md:aspect-[2/1] rounded-lg shadow-md flex flex-col justify-center items-center p-4">
          <h3 className="text-lg font-semibold mb-2">{category} Difficulty</h3>
          <p className="text-sm text-gray-600">No flags available in this category.</p>
        </div>
      );
    }

    const progressValue = (collectedCount * 100) / totalCount;
    const progressColor = progressValue === 100 ? 'bg-green-500' : progressValue > 50 ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div className="bg-gray-100 w-full mx-2 aspect-[3/1] md:aspect-[2/1] rounded-lg shadow-md flex flex-col justify-center items-center p-4">
        <h3 className="text-lg font-semibold mb-2">{category} Difficulty</h3>
        <h4 className="text-sm font-semibold mb-2">Collected</h4>

        <LinearProgress
          variant="determinate"
          value={progressValue}
          className={`w-full rounded-lg mb-2 ${progressColor}`}
          aria-label={`Progress for ${category} difficulty`}
        />

        <h4 className="text-sm font-semibold">
          {collectedCount}/{totalCount}
        </h4>
      </div>
    );
  };


  return (
    <>
      <div className="flex w-full max-w-[1440px] mx-auto flex-col">
        <div className="w-[50%] flex flex-row justify-between items-center gap-2 my-5 mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.label.toLowerCase())}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition font-medium
                ${activeTab === tab.label.toLowerCase()
                  ? "bg-gray-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"}`}
            >
              <Icon icon={tab.icon} className="text-xl" />
              {tab.label}
            </button>
          ))}
        </div>

        {unsafeID && flagList.length > 0 ? (
          activeTab === "flags" ? (
            <div className="flex flex-col items-center justify-center w-[95%] md:w-[80%] h-full p-6 mx-auto gap-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Score: {score}</h2>

              <LinearProgress
                variant="determinate"
                value={
                  (flagList.filter((flag) => flag.collected).length * 100) /
                  flagList.length
                }
                className="w-full rounded-full h-3 mb-6 bg-gray-200"
                sx={{
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4CAF50',
                  },
                }}
              />

              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <FlagsByCategory category="Easy" />
                <FlagsByCategory category="Medium" />
                <FlagsByCategory category="Hard" />
              </div>

              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <TextField
                  id="flag-input"
                  label="Enter Flag"
                  variant="outlined"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="e.g. 0UCd+3QzVigUUdtBnUz1EtCOTlUauHp7HXxEcAVehSt2zFytqsZEG4Sd0Mmu7q5k"
                  className="w-full py-2 px-4 rounded-md"
                  type="password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#4CAF50',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem',
                    },
                  }}
                />
                <button
                  onClick={() => handleFlagSubmit()}
                  className="bg-black text-white rounded-full h-14 w-14 flex items-center justify-center hover:bg-gray-700 transition-all duration-200"
                >
                  <SendIcon className="text-white" />
                </button>
              </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Flags to Collect</h2>                  
              <Filters />
              <div className="flex justify-between items-center w-full mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200 ${currentPage === 1 ? "cursor-not-allowed" : ""
                    }`}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200 ${currentPage === totalPages ? "cursor-not-allowed" : ""
                    }`}
                >
                  Next
                </button>
              </div>
              <FlagsList flags={flagList.slice(startIndex, endIndex)} />
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center w-[95%] md:w-[80%] h-full p-6 mx-auto gap-4 bg-white rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-4">Live Scoreboard</h2>

              <div className="w-full">
                <div className="grid grid-cols-3 text-sm font-semibold text-gray-800 border-b pb-2 mb-2">
                  <span>Position</span>
                  <span className="text-center">Name</span>
                  <span className="text-right">Score</span>
                </div>
                {liveScoreBoard.length > 0 ? (
                  <AnimatePresence>
                    {liveScoreBoard.map((user, index) => (
                      <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`grid grid-cols-3 items-center py-2 px-3 rounded-xl transition-all ${user.name === fullName ? "bg-blue-100" : ""
                          }`}
                      >
                        <span className="font-medium">{index + 1}</span>
                        <span className="text-center truncate">{user.name}</span>
                        <span className="text-right font-semibold">{user.score}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <p className="text-center text-gray-500 mt-4">No scores yet.</p>
                )}
              </div>
            </div>


          )
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <h1 className="text-2xl font-bold">Not logged in</h1>
            <p className="text-gray-500">Please log in to play the CTF</p>
            <Link
              href="/account/authenticate"
              className="mt-4 text-blue-500 hover:underline"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
