import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() =>
        document.documentElement.classList.contains("dark")
    );

    const toggleTheme = () => {
        const html = document.documentElement;
        html.classList.toggle("dark");
        localStorage.setItem(
            "theme",
            html.classList.contains("dark") ? "dark" : "light"
        );
        setIsDark(html.classList.contains("dark"));
    };

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        if (stored === "dark" || (!stored && prefersDark)) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    }, []);

    return (
        <Button onClick={toggleTheme} variant="ghost" size="icon">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}