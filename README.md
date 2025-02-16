# Transcendence Frontend

## Project Structure
```plaintext
transcendance-front/
├── index.html
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── game.css
│   │   ├── chat.css
│   │   └── accessibility.css
│   ├── i18n/
│   │   ├── en.json
│   │   ├── fr.json
│   │   └── es.json
│   └── images/
└── src/
    ├── app.js
    ├── config/
    │   └── api.js
    ├── components/
    │   ├── ui/
    │   ├── game/
    │   └── chat/
    ├── services/
    │   ├── WebSocketService.js
    │   ├── ApiService.js
    │   └── StateService.js
    └── utils/
        ├── i18n.js
        └── accessibility.js