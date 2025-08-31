import React, { useState, useEffect } from "react";
import "./index.css";

type Score = {
  wins: number;
  losses: number;
  ties: number;
};

export const App: React.FC = () => {
  const initialScore = localStorage.getItem("score");
  const [score, setScore] = useState<Score>(
    initialScore ? JSON.parse(initialScore) : { wins: 0, losses: 0, ties: 0 }
  );

  const [playerMove, setPlayerMove] = useState<string | null>(null);
  const [computerMove, setComputerMove] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [autoPlaying, setAutoPlaying] = useState(false);

  const moves: string[] = ["rock", "paper", "scissors"];

  const getRandomMove = (): string => {
    const index = Math.floor(Math.random() * moves.length);
    return moves[index]!;
  };

  const playRound = (player: string) => {
    const computer = getRandomMove();
    setPlayerMove(player);
    setComputerMove(computer);

    let roundResult = "";
    if (player === computer) roundResult = "Tie.";
    else if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      roundResult = "You win.";
    } else {
      roundResult = "You lose.";
    }

    setResult(roundResult);

    const newScore = { ...score };
    if (roundResult === "You win.") newScore.wins += 1;
    else if (roundResult === "You lose.") newScore.losses += 1;
    else if (roundResult === "Tie.") newScore.ties += 1;

    setScore(newScore);
    localStorage.setItem("score", JSON.stringify(newScore));
  };

  const resetScore = () => {
    const newScore = { wins: 0, losses: 0, ties: 0 };
    setScore(newScore);
    localStorage.setItem("score", JSON.stringify(newScore));
    setPlayerMove(null);
    setComputerMove(null);
    setResult("");
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoPlaying) {
      interval = setInterval(() => {
        const move = getRandomMove();
        playRound(move);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoPlaying, score]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "r") playRound("rock");
      else if (key === "p") playRound("paper");
      else if (key === "s") playRound("scissors");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [score]);

  return (
    <div className="game-container">
      <h1 className="game-heading">Rock Paper Scissors</h1>

      <div className="all-images">
        {moves.map((move) => (
          <button
            key={move}
            className="background-border"
            onClick={() => playRound(move)}
          >
            <img src={`${move}-emoji.png`} alt={move} className="move-icon" />
          </button>
        ))}
      </div>

      <p className="js-result fw-bold">{result}</p>

      {playerMove && computerMove && (
        <div className="js-moves">
          <span>You:</span>
          <img src={`${playerMove}-emoji.png`} alt={playerMove} className="move-icon" />
          <span>vs</span>
          <img src={`${computerMove}-emoji.png`} alt={computerMove} className="move-icon" />
          <span>Computer</span>
        </div>
      )}

      <p className="js-score">
        Wins: {score.wins}, Losses: {score.losses}, Ties: {score.ties}
      </p>

      <div>
        <button className="reset-button" onClick={resetScore}>Reset Score</button>
        <button className="auto-play" onClick={() => setAutoPlaying(!autoPlaying)}>
          {autoPlaying ? "Stop Play" : "Auto Play"}
        </button>
      </div>
    </div>
  );
};

export default App;
