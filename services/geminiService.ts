import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder for environments where the key is not set.
  // The web app environment is expected to have this variable.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const readFileAsText = (file: File): Promise<{ name: string, content: string }> => {
  return new Promise((resolve, reject) => {
    // Limit file size to prevent sending huge amounts of data
    if (file.size > 1024 * 1024) { // 1MB limit
        resolve({ name: file.name, content: `[File is too large to read content (${(file.size / (1024*1024)).toFixed(2)} MB)]` });
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // We only care about text-based content. Heuristic check.
      const content = reader.result as string;
      // Simple check for binary content
      if (content.includes('\uFFFD')) {
          resolve({ name: file.name, content: '[Binary file content not readable]' });
      } else {
          resolve({ name: file.name, content: content.substring(0, 5000) }); // Truncate content
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const generateBuildScript = async (prompt: string, files: File[]): Promise<string> => {
  const fileContents = await Promise.all(files.map(readFileAsText));
  
  const fileDetails = fileContents.length > 0
    ? `The user has provided the following files for extra context. Use them to inform your choices for packages and desktop environment:\n\n${fileContents.map(f => `File: ${f.name}\nSnippet:\n---\n${f.content}\n---\n`).join('\n')}`
    : 'The user has not provided any files. Rely solely on their prompt for customization.';

  const systemInstruction = `You are an expert in Debian-based Linux systems and the 'live-build' tool. Your task is to generate a comprehensive, single, executable shell script that, when run on a Debian or Ubuntu system, will create a bootable .ISO file.

RULES:
1.  **Core Application:** The generated OS MUST include Visual Studio Code. Download its .deb package from the official source and install it.
2.  **User Customization:** Use the user's prompt and file context to customize the OS. This includes selecting a desktop environment (like XFCE, GNOME, KDE, or a tiling window manager), a theme, and a set of additional pre-installed packages. If the user doesn't specify a desktop, default to XFCE.
3.  **Build Tool:** You MUST use the 'live-build' utility. The script should start by installing 'live-build' and its dependencies if they are not present.
4.  **Placeholder:** Use the exact placeholder '__OS_NAME__' for the OS name. This will be used for the hostname, ISO filename, and any other user-facing branding. Do not use any other placeholder format.
5.  **Structure:** The script must be self-contained. It should create a directory, configure 'live-build' inside it, place necessary hooks or package lists, and finally run 'lb build' to generate the ISO.
6.  **Clarity:** The script MUST be heavily commented to explain each major step to the user (e.g., "# ==> Installing dependencies", "# ==> Creating config", "# ==> Adding VS Code package", "# ==> Building the ISO").
7.  **Output:** The final output from you must be ONLY the raw shell script content. Do not wrap it in markdown backticks or any other formatting.`;
  
  const fullPrompt = `
    User's core idea for the OS: "${prompt}"

    ${fileDetails}

    Now, generate the complete 'build.sh' script following all the rules in the system instructions.
    The script should be robust and runnable. Make a sensible choice for the desktop environment based on the user's prompt (e.g., if they say "lightweight", choose XFCE or LXDE).
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      },
    });

    const scriptText = response.text.trim();
    if (!scriptText.startsWith('#!/bin/bash')) {
        return `#!/bin/bash\n\n${scriptText}`;
    }
    return scriptText;
  } catch (error) {
    console.error("Error generating build script:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate build script from API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the build script.");
  }
};