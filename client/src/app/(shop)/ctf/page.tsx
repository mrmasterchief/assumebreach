import React, { useEffect } from "react";

export default function CTF() {
    useEffect(() => {
        window.location.href = "/ctf/scoreboard";
    }, []);
}