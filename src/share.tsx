import { DeepReadonly } from "solid-js/store";
import { GAME_COLS, GAME_ROWS } from "./constants";
import { BoxState, GameData, GameMode, ShareType } from "./types";
import { gtagWrap } from "./utils";

export const getNumEmoji = (num: number) => {
  if (num < 0) {
    return "\uD83D\uDFE5";
  } else if (num === 0) {
    return "1️⃣";
  } else if (num === 1) {
    return "2️⃣";
  } else if (num === 2) {
    return "3️⃣";
  } else if (num === 3) {
    return "4️⃣";
  } else if (num === 4) {
    return "5️⃣";
  } else if (num === 5) {
    return "6️⃣";
  } else if (num === 6) {
    return "7️⃣";
  } else if (num === 7) {
    return "8️⃣";
  } else if (num === 8) {
    return "9️⃣";
  }
};

const getEmojiRow = (states: readonly BoxState[] | undefined) => {
  let emojis = "";
  if (!states || states.length === 0) {
    return "\u2B1B\u2B1B\u2B1B\u2B1B\u2B1B";
  }
  for (let i = 0; i < states.length; i++) {
    if (states[i] === "correct") {
      emojis += "\uD83D\uDFE9";
    } else if (states[i] === "diff") {
      emojis += "\uD83D\uDFE8";
    } else if (states[i] === "none") {
      emojis += "\u2B1C";
    }
  }
  return emojis;
};

const getColorFromState = (state: BoxState | undefined) => {
  if (!state) return "#2d2d2d";
  if (state === "correct") return "#00cc88";
  if (state === "diff") return "#ffcc00";
  if (state === "none") return "#e0e0e0";
  return "#2d2d2d";
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const radius_obj = { tl: radius, tr: radius, br: radius, bl: radius };
  ctx.beginPath();
  ctx.moveTo(x + radius_obj.tl, y);
  ctx.lineTo(x + width - radius_obj.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius_obj.tr);
  ctx.lineTo(x + width, y + height - radius_obj.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius_obj.br,
    y + height
  );
  ctx.lineTo(x + radius_obj.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius_obj.bl);
  ctx.lineTo(x, y + radius_obj.tl);
  ctx.quadraticCurveTo(x, y, x + radius_obj.tl, y);
  ctx.closePath();
  ctx.fill();
}

export const shareGame = (
  mode: GameMode,
  gameData: DeepReadonly<GameData>,
  shareType: ShareType
) => {
  let textShare = "";
  if (mode === "daily") {
    textShare =
      "Daily Quordle #" +
      gameData.seed.toString(10) +
      "\n" +
      getNumEmoji(gameData.answersCorrect[0]) +
      getNumEmoji(gameData.answersCorrect[1]) +
      "\n" +
      getNumEmoji(gameData.answersCorrect[2]) +
      getNumEmoji(gameData.answersCorrect[3]);
  } else {
    textShare =
      "Practice Quordle\n" +
      getNumEmoji(gameData.answersCorrect[0]) +
      getNumEmoji(gameData.answersCorrect[1]) +
      (" " +
        gameData.answers[0].toUpperCase() +
        " - " +
        gameData.answers[1].toUpperCase()) +
      "\n" +
      getNumEmoji(gameData.answersCorrect[2]) +
      getNumEmoji(gameData.answersCorrect[3]) +
      (" " +
        gameData.answers[2].toUpperCase() +
        " - " +
        gameData.answers[3].toUpperCase());
  }

  textShare += "\nquordle.com";
  const textMobileShare = textShare;
  textShare += "\n";

  let l1 = GAME_ROWS - 1;
  if (gameData.answersCorrect[0] >= 0 && gameData.answersCorrect[1] >= 0) {
    l1 = Math.max(gameData.answersCorrect[0], gameData.answersCorrect[1]);
  }
  let l2 = GAME_ROWS - 1;
  if (gameData.answersCorrect[2] >= 0 && gameData.answersCorrect[3] >= 0) {
    l2 = Math.max(gameData.answersCorrect[2], gameData.answersCorrect[3]);
  }
  for (let i = 0; i <= l1; i++) {
    textShare +=
      getEmojiRow(gameData.states[0][i]) +
      " " +
      getEmojiRow(gameData.states[1][i]) +
      "\n";
  }
  textShare += "\n";
  for (let i = 0; i <= l2; i++) {
    textShare +=
      getEmojiRow(gameData.states[2][i]) +
      " " +
      getEmojiRow(gameData.states[3][i]) +
      "\n";
  }

  gtagWrap("event", "share", {
    mode: mode,
    share_type: shareType,
    daily_seed: mode === "daily" ? gameData.seed : undefined,
  });

  if (shareType === "clipboard") {
    navigator.clipboard.writeText(textShare);
  } else if (shareType === "share") {
    navigator.share({
      text: textShare,
    });
  } else if (shareType === "image") {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textMobileShare);
    }
    const canvas = document.createElement("canvas");
    canvas.style.display = "none";

    const size = 64;
    const padding = size / 16;
    const radius = size / 8;
    const fontScale = 0.75;
    const textPadding = size / 4;
    canvas.width = (size + padding) * 11 - padding;
    canvas.height = (size + padding) * (l1 + 1 + l2 + 1 + 4) - padding;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw words 1 + 2
    let x = 0;
    let y = 0;
    for (let i = 0; i <= l1; i++) {
      let states = gameData.states[0][i];
      for (x = 0; x < GAME_COLS; x++) {
        ctx.fillStyle = getColorFromState(states?.[x]);
        roundRect(
          ctx,
          x * (size + padding),
          y * (size + padding),
          size,
          size,
          radius
        );
      }

      states = gameData.states[1][i];
      for (x = 6; x < GAME_COLS + 6; x++) {
        ctx.fillStyle = getColorFromState(states?.[x - 6]);
        roundRect(
          ctx,
          x * (size + padding),
          y * (size + padding),
          size,
          size,
          radius
        );
      }
      y++;
    }

    // draw middle text
    ctx.font = size * fontScale + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";

    const titleText =
      mode === "daily"
        ? "Daily Quordle #" + gameData.seed.toString(10)
        : "Practice Quordle";
    let metrics = ctx.measureText(titleText);
    let fontHeight = metrics.actualBoundingBoxAscent;
    ctx.fillText(
      titleText,
      canvas.width / 2,
      y * (size + padding) + size - (size - fontHeight) / 2,
      canvas.width - textPadding * 2
    );
    y++;
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 2; i++) {
        ctx.fillStyle =
          gameData.answersCorrect[i + row * 2] >= 0 ? "#00a6ed" : "#f8312f";
        const dir = i * 2 - 1;
        const xTopCenter =
          canvas.width / 2 + dir * (padding / 2) + dir * (size / 2);
        roundRect(
          ctx,
          xTopCenter - size / 2,
          y * (size + padding),
          size,
          size,
          radius
        );
        if (gameData.answersCorrect[i + row * 2] >= 0) {
          ctx.textAlign = "center";
          ctx.fillStyle = "#ffffff";
          const numText = String(gameData.answersCorrect[i + row * 2] + 1);
          metrics = ctx.measureText(numText);
          fontHeight =
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
          ctx.fillText(
            numText,
            xTopCenter,
            y * (size + padding) + size - (size - fontHeight) / 2,
            size
          );
        }
      }
      if (mode === "free") {
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        let wordText = gameData.answers[0 + row * 2].toUpperCase();
        metrics = ctx.measureText(wordText);
        fontHeight =
          metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        ctx.fillText(
          wordText,
          canvas.width / 2 - padding / 2 - size - textPadding,
          y * (size + padding) + size - (size - fontHeight) / 2,
          canvas.width / 2 - padding - size - textPadding * 2
        );
        ctx.textAlign = "left";
        wordText = gameData.answers[1 + row * 2].toUpperCase();
        metrics = ctx.measureText(wordText);
        fontHeight =
          metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        ctx.fillText(
          wordText,
          canvas.width / 2 + padding / 2 + size + textPadding,
          y * (size + padding) + size - (size - fontHeight) / 2,
          canvas.width / 2 - padding - size - textPadding * 2
        );
      }
      y++;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      "quordle.com",
      canvas.width / 2,
      y * (size + padding) + size / 2,
      canvas.width
    );
    y++;

    // draw words 3 + 4
    for (let i = 0; i <= l2; i++) {
      x = 0;
      let states = gameData.states[2][i];
      for (x = 0; x < GAME_COLS; x++) {
        ctx.fillStyle = getColorFromState(states?.[x]);
        roundRect(
          ctx,
          x * (size + padding),
          y * (size + padding),
          size,
          size,
          radius
        );
      }

      states = gameData.states[3][i];
      for (x = 6; x < GAME_COLS + 6; x++) {
        ctx.fillStyle = getColorFromState(states?.[x - 6]);
        roundRect(
          ctx,
          x * (size + padding),
          y * (size + padding),
          size,
          size,
          radius
        );
      }
      y++;
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "quordle.png", { type: "image/png" });
      navigator.share({
        files: [file],
        text: textMobileShare,
      });
    });
  }
};
