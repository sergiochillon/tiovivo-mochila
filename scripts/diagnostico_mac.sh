#!/usr/bin/env bash
# diagnostico_mac.sh — diagnóstico SOLO LECTURA para el equipo TIOVIVO.exe
#
# Qué hace: muestra versiones y estado de herramientas. Nada más.
# Qué NO hace: no instala nada, no modifica archivos ni configuración, no escribe en disco,
#              no imprime variables de entorno, tokens ni claves, no lee claves privadas SSH.
# Qué hace en red: solo comprueba si github.com y registry.npmjs.org responden (HEAD, 5 s).
#
# Uso:  bash diagnostico_mac.sh
# Después: copia TODA la salida y pégala en el chat del equipo (no contiene secretos,
#          pero revísala antes de enviarla).

# Sin 'set -e': un comando que falle no debe cortar el diagnóstico.
LC_ALL=C

have() { command -v "$1" >/dev/null 2>&1; }
line() { printf '%s\n' "------------------------------------------------------------"; }
row()  { printf '%-26s %s\n' "$1" "$2"; }

echo "DIAGNÓSTICO TIOVIVO.exe (solo lectura) — $(date '+%Y-%m-%d %H:%M')"
line
echo "[1] Sistema"
if have sw_vers; then
  row "macOS" "$(sw_vers -productVersion 2>/dev/null) ($(sw_vers -buildVersion 2>/dev/null))"
else
  row "macOS" "sw_vers no encontrado (¿no es un Mac?) — $(uname -s 2>/dev/null)"
fi
row "Arquitectura" "$(uname -m 2>/dev/null)  (esperado: arm64 en M1)"
if have sysctl; then
  mem=$(sysctl -n hw.memsize 2>/dev/null)
  [ -n "$mem" ] && row "RAM" "$((mem / 1024 / 1024 / 1024)) GB"
  row "CPU" "$(sysctl -n machdep.cpu.brand_string 2>/dev/null)"
fi
row "Disco libre (/)" "$(df -h / 2>/dev/null | awk 'NR==2 {print $4 " libres de " $2}')"
if have xcode-select; then
  row "Xcode CLT" "$(xcode-select -p 2>/dev/null || echo 'NO instaladas')"
fi

line
echo "[2] Git y GitHub"
if have git; then
  row "git" "$(git --version 2>/dev/null)"
  name=$(git config --global user.name 2>/dev/null)
  email=$(git config --global user.email 2>/dev/null)
  row "git user.name" "${name:-NO configurado}"
  if [ -n "$email" ]; then row "git user.email" "configurado (valor no mostrado)"; else row "git user.email" "NO configurado"; fi
  row "credential.helper" "$(git config --global credential.helper 2>/dev/null || echo 'no definido')"
  row "init.defaultBranch" "$(git config --global init.defaultBranch 2>/dev/null || echo 'no definido')"
else
  row "git" "NO encontrado"
fi
if have gh; then
  row "GitHub CLI (gh)" "$(gh --version 2>/dev/null | head -n1)"
  # Se filtran líneas que mencionan 'token' para no mostrar ni siquiera su versión enmascarada.
  echo "gh auth status (filtrado):"
  gh auth status 2>&1 | grep -v -i 'token' | sed 's/^/    /'
else
  row "GitHub CLI (gh)" "NO encontrado"
fi
n_pub=$(ls "$HOME"/.ssh/*.pub 2>/dev/null | wc -l | tr -d ' ')
row "Claves SSH públicas" "${n_pub:-0} encontradas (solo se cuenta; no se lee ninguna)"

line
echo "[3] Lenguajes y gestores"
if have node; then row "node" "$(node --version 2>/dev/null)"; else row "node" "NO encontrado"; fi
if have npm;  then row "npm"  "$(npm --version 2>/dev/null)";  else row "npm"  "NO encontrado"; fi
if have pnpm; then row "pnpm" "$(pnpm --version 2>/dev/null)"; fi
if have yarn; then row "yarn" "$(yarn --version 2>/dev/null)"; fi
if have python3; then row "python3" "$(python3 --version 2>&1)"; else row "python3" "NO encontrado"; fi
if have pip3; then row "pip3" "$(pip3 --version 2>/dev/null | cut -d' ' -f1-2)"; fi
if have brew; then row "Homebrew" "$(brew --version 2>/dev/null | head -n1)"; else row "Homebrew" "no encontrado (no es obligatorio)"; fi
if have docker; then row "docker" "$(docker --version 2>/dev/null)"; else row "docker" "no encontrado (no se necesita)"; fi

line
echo "[4] Editor y herramientas de IA"
if have code; then
  row "VS Code (CLI 'code')" "$(code --version 2>/dev/null | head -n1)"
elif [ -d "/Applications/Visual Studio Code.app" ]; then
  row "VS Code" "instalado, pero el comando 'code' no está en el PATH"
else
  row "VS Code" "NO encontrado"
fi
for app in "ChatGPT" "Antigravity" "Google Chrome" "Safari" "Keynote"; do
  if [ -d "/Applications/$app.app" ]; then row "App: $app" "instalada"; else row "App: $app" "no encontrada en /Applications"; fi
done

line
echo "[5] Red (solo comprobación de respuesta)"
if have curl; then
  for u in https://github.com https://registry.npmjs.org; do
    code=$(curl -s -o /dev/null -m 5 -I -w '%{http_code}' "$u" 2>/dev/null)
    row "$u" "HTTP ${code:-sin respuesta}"
  done
else
  row "curl" "NO encontrado"
fi

line
echo "[6] Resumen rápido (qué falta para el equipo)"
missing=""
for tool in git gh node npm python3; do have "$tool" || missing="$missing $tool"; done
have code || missing="$missing code(VS Code CLI)"
if [ -z "$missing" ]; then
  echo "Todas las herramientas básicas están presentes."
else
  echo "Faltan o no están en el PATH:$missing"
  echo "NO instales nada por tu cuenta: avisa a Sergio y decidimos juntos qué se necesita de verdad."
fi
if have gh && ! gh auth status >/dev/null 2>&1; then
  echo "gh está instalado pero SIN sesión iniciada (se hará con 'gh auth login' cuando lo decidamos)."
fi
line
echo "Fin. Este script no ha modificado nada."
