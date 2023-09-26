# Verwende ein Node.js-Basisimage mit der gewünschten Version
FROM node:18.18.0

# Setze das Arbeitsverzeichnis im Container
WORKDIR /bib

# Kopiere die package.json- und package-lock.json-Dateien, um die Abhängigkeiten zu installieren
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest deiner Anwendung in das Arbeitsverzeichnis
COPY . .

# Baue die Next.js-Anwendung für die Produktion
RUN npm run build

# Öffne den Port, auf dem die Anwendung ausgeführt wird (Standardmäßig 3000 für Next.js)
EXPOSE 3000

# Starte die Anwendung beim Containerstart
CMD ["npx", "next", "start"]
