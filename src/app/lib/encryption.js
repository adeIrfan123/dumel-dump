const encoder = new TextEncoder();

export async function deriveEncryptionKey(password, salt) {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const encryptionKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 600000,
      hash: "SHA-256",
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  return encryptionKey;
}

export async function exportEncryptionKey(encryptionKey) {
  const exportedKey = await crypto.subtle.exportKey("raw", encryptionKey);

  const keyArray = new Uint8Array(exportedKey);

  return btoa(String.fromCharCode(...keyArray));
}

export async function importEncryptionKey(keyString) {
  const keyBytes = Uint8Array.from(atob(keyString), (char) =>
    char.charCodeAt(0),
  );

  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptText(text, encryptionKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    encryptionKey,
    encoder.encode(text),
  );

  const encryptedBytes = new Uint8Array(encryptedData);

  const combined = new Uint8Array(iv.length + encryptedBytes.length);

  combined.set(iv);
  combined.set(encryptedBytes, iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptText(encryptedText, encryptionKey) {
  const combined = Uint8Array.from(atob(encryptedText), (char) =>
    char.charCodeAt(0),
  );

  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    encryptionKey,
    encryptedData,
  );

  return new TextDecoder().decode(decryptedData);
}

export async function encryptFile(file, key) {
  const arrayBuffer = await file.arrayBuffer();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    arrayBuffer,
  );

  const mimeTypeBytes = new TextEncoder().encode(file.type);

  const encryptedBuffer = new Uint8Array(
    1 + mimeTypeBytes.length + iv.length + encryptedData.byteLength,
  );

  let offset = 0;

  encryptedBuffer[offset] = mimeTypeBytes.length;
  offset += 1;

  encryptedBuffer.set(mimeTypeBytes, offset);
  offset += mimeTypeBytes.length;

  encryptedBuffer.set(iv, offset);
  offset += iv.length;

  encryptedBuffer.set(new Uint8Array(encryptedData), offset);

  return new File([encryptedBuffer], `encrypted-${file.name}.enc`, {
    type: "application/octet-stream",
  });
}

export async function decryptFile(blob, key) {
  const arrayBuffer = await blob.arrayBuffer();

  const data = new Uint8Array(arrayBuffer);

  let offset = 0;

  const mimeTypeLength = data[offset];
  offset += 1;

  const mimeTypeBytes = data.slice(offset, offset + mimeTypeLength);

  const mimeType = new TextDecoder().decode(mimeTypeBytes);

  offset += mimeTypeLength;

  const iv = data.slice(offset, offset + 12);
  offset += 12;

  const encryptedData = data.slice(offset);

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedData,
  );
  return new Blob([decryptedData], {
    type: mimeType,
  });
}
