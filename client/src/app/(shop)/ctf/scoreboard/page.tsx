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

export default function ScoreBoard() {
  const [score, setScore] = useState<number>(0);
  const [flagInput, setFlagInput] = useState<string>("");

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
    "difficulty" | "collected" | "securityCategory"
  >("difficulty");
  const [unsafeID, setUnsafeID] = useState<string | null>(null);

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
          [() => getFlagsList({ unsafeID: unsafeID })],
          (results) => {
            setFlagList(results[0].flags);
            setScore(results[0].score);
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
    if (!/CTF{.*}/.test(flagInput)) {
      showMessage("Error", "Invalid flag format", "error");
      return;
    }
    try {
      await indexFunction(
        [() => submitFlag({ unsafeID: unsafeID || "", flag: flagInput })],
        () => {
          setFlagCorrect(true);
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
                | "securityCategory"
            );
            sortFlagsList({
              sortByOption: event.target.value as
                | "difficulty"
                | "collected"
                | "securityCategory",
            });
          }}
        >
          <MenuItem value="difficulty">Difficulty</MenuItem>
          <MenuItem value="collected">Collected</MenuItem>
          <MenuItem value="securityCategory">Security Category</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const FlagsList = () => {
    return flagList.map((flag, index) => (
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
    return (
      <div className="bg-gray-100 w-full mx-2 aspect-[3/1] md:aspect-[2/1] rounded-lg shadow-md flex flex-col justify-around items-center p-2">
        <h3 className="text-lg font-semibold">{category} Difficulty</h3>
        <h4 className="text-sm font-semibold">Collected</h4>
        <LinearProgress
          variant="determinate"
          value={
            (flagList
              .filter((flag) => flag.difficulty === category)
              .filter((flag) => flag.collected).length *
              100) /
            flagList.filter((flag) => flag.difficulty === category).length
          }
          className="w-full rounded-lg"
        />
        <h4 className="text-sm font-semibold">
          {
            flagList
              .filter((flag) => flag.difficulty === category)
              .filter((flag) => flag.collected).length
          }
          /{flagList.filter((flag) => flag.difficulty === category).length}
        </h4>
      </div>
    );
  };
  return (
    <>
      <div className="flex w-full max-w-[1440px] mx-auto flex-col">
        {unsafeID && flagList.length > 0 ? (
          <div className="flex flex-col items-center justify-center w-[95%] md:w-[80%] h-full p-4 mx-auto gap-2">
            <h1 className="text-2xl font-semibold">CTF Scoreboard</h1>
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 mb-5">
              <FlagsByCategory category="Easy" />
              <FlagsByCategory category="Medium" />
              <FlagsByCategory category="Hard" />
            </div>
            <div className="w-full flex flex-row justify-between items-center gap-2 mb-5">
              <TextField
                id="flag-input"
                label="Flag"
                variant="outlined"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="Enter a flag. e.g. CTF{I_L0VE_CTF}"
                className="w-full"
                type="password"
              />
              <button
                onClick={() => {
                  handleFlagSubmit();
                }}
                className="bg-black text-white rounded-lg h-16 w-16"
              >
                <SendIcon />
              </button>
            </div>

            <Filters />
            <FlagsList />
          </div>
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
