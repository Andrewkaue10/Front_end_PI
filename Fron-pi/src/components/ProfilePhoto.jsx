import { useState } from "react";
import { api } from "../lib/api";
export default function ProfilePhoto({ me }) {
  const [photo, setPhoto] = useState(me.avatarData),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save(avatarData) {
    await api("/account/avatar", { method: "PUT", body: { avatarData } });
    setPhoto(avatarData);
    window.dispatchEvent(
      new CustomEvent("nexhub:avatar", { detail: avatarData }),
    );
  }
  async function upload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    let url;
    try {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 8 * 1024 * 1024
      )
        throw new Error("Escolha JPG, PNG ou WebP de até 8 MB.");
      url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 400, 400);
      const side = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        400,
        400,
      );
      await save(canvas.toDataURL("image/jpeg", 0.85));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (url) URL.revokeObjectURL(url);
    }
  }
  async function remove() {
    setBusy(true);
    setError("");
    try {
      await save(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="photo-editor area-card">
      <div className="photo-preview">
        {photo ? (
          <img src={photo} alt="Sua foto de perfil" />
        ) : (
          <span>{me.name?.slice(0, 1)}</span>
        )}
      </div>
      <div>
        <h2>Foto de perfil</h2>
        <p>JPG, PNG ou WebP, até 8 MB. A foto será recortada no centro.</p>
        <div className="photo-actions">
          <label className="area-button">
            {busy ? "Salvando…" : "Escolher foto"}
            <input
              aria-label="Escolher foto de perfil"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={upload}
            />
          </label>
          {photo && (
            <button
              className="area-button secondary"
              disabled={busy}
              onClick={remove}
            >
              Remover foto
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="area-alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
