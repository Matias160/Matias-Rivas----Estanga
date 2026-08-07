import { useState } from 'react';

type Theme = 'light' | 'dark';
type Player = 'X' | 'O';
type SquareValue = Player | null;

type SquareProps = {
  value: SquareValue;
  onSquareClick: () => void;
};

type BoardProps = {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
};

function Square({ value, onSquareClick }: SquareProps) {
  // Cada casillero recibe su valor y su accion por props.
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(index: number) {
    // Evita jugar sobre casilleros ocupados o partidas terminadas.
    if (calculateWinner(squares) || squares[index]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  const status = winner
    ? `Ganador: ${winner}`
    : isDraw
      ? 'Empate'
      : `Siguiente jugador: ${xIsNext ? 'X' : 'O'}`;

  return (
    <section className="board-area">
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, index) => (
          <Square key={index} value={square} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquareValue[]) {
    // Guarda la historia para poder volver a movimientos anteriores.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    // Permite navegar por el historial de jugadas.
    setCurrentMove(nextMove);
  }

  function resetGame() {
    // Reinicia completamente el tablero y el historial.
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function toggleTheme() {
    // Cambia entre modo dia y noche.
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Ir al movimiento #${move}` : 'Ir al inicio';

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} disabled={move === currentMove}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <main className="app" data-theme={theme}>
      <section className="glass game-shell">
        <header className="game-header">
          <div>
            <span className="tag">Punto extra</span>
            <h1>Tateti</h1>
          </div>
          <div className="actions">
            <button onClick={toggleTheme}>{theme === 'light' ? 'Modo noche' : 'Modo dia'}</button>
            <button onClick={resetGame}>Reiniciar</button>
          </div>
        </header>

        <div className="game">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          <aside className="game-info">
            <h2>Movimientos</h2>
            <ol>{moves}</ol>
          </aside>
        </div>
      </section>
    </main>
  );
}

function calculateWinner(squares: SquareValue[]) {
  // Combinaciones ganadoras posibles del tateti.
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
