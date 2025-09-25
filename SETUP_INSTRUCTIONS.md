# 🚀 EduPlanner DSA - Setup Instructions

## AI Integration Complete ✅

La integración de los tres agentes de IA (Analyst, Evaluator, Optimizer) está completamente configurada y lista para usar.

## 📋 Pasos de Configuración

### 1. Configurar la API Key de Google Gemini

**IMPORTANTE:** Necesitas obtener una API key de Google Gemini AI:

1. Ve a [Google AI Studio](https://ai.google.dev/)
2. Crea una cuenta y genera tu API key
3. Copia tu API key

### 2. Configurar el Backend

```bash
# Navegar al directorio backend
cd backend

# Editar el archivo .env y reemplazar tu API key
# Abrir backend/.env y reemplazar:
# API_KEY=your_google_genai_api_key_here
# Por tu API key real:
# API_KEY=tu_api_key_aqui
```

### 3. Ejecutar la Aplicación

**Necesitas ejecutar DOS terminales simultáneamente:**

#### Terminal 1 - Backend Proxy Server:
```bash
cd backend
npm start
```
Deberías ver: `🚀 Secure Gemini proxy server is running on http://localhost:3001`

#### Terminal 2 - Frontend React App:
```bash
# En el directorio raíz del proyecto
npm run dev
```
Deberías ver: `Local: http://localhost:3000` (o puerto similar)

## 🤖 Agentes de IA Configurados

### 📊 Analyst Agent
- **Función:** Especialista en datos para análisis de patrones de aprendizaje
- **Módulos:** Feedback de habilidades, justificaciones, revisiones de rendimiento
- **Características:** Identifica tendencias, detecta problemas, intervención temprana

### 📋 Evaluator Agent
- **Función:** Coach instruccional para evaluación de contenido
- **Módulos:** Practice Lab (evaluación de estrategias y código)
- **Características:** Framework CIDPP, feedback estructurado, evaluación objetiva

### ⚡ Optimizer Agent
- **Función:** Generador de contenido experto
- **Módulos:** Módulos de aprendizaje, explicaciones profundas, problemas de código
- **Características:** Contenido adaptativo, perfiles cognitivos, optimización didáctica

## 🔧 Funciones Principales del Sistema

### Análisis de Estudiantes (Analyst)
- `generateSkillFeedback()` - Feedback personalizado basado en datos
- `generateJustification()` - Justificaciones basadas en patrones de aprendizaje
- `generatePerformanceReview()` - Análisis completo de tendencias
- `generateAdaptiveLearningStep()` - Pasos adaptativos óptimos

### Evaluación de Contenido (Evaluator)
- `generateStrategyFeedback()` - Evaluación de estrategias de solución
- `generateCodeFeedback()` - Revisión comprensiva de código

### Generación de Contenido (Optimizer)
- `generateLearningModuleContent()` - Módulos adaptativos personalizados
- `generateDeeperExplanation()` - Explicaciones expandidas
- `generateCodingProblem()` - Problemas de práctica optimizados

## ⚠️ Notas Importantes

1. **Seguridad:** La API key nunca se expone al frontend - todo pasa por el proxy backend
2. **CORS:** El backend maneja todas las políticas CORS automáticamente
3. **Errores:** Sistema de manejo de errores robusto con fallbacks
4. **Tipos:** Completamente tipado con TypeScript para mejor DX

## 🎯 Verificación de Funcionamiento

Una vez que ambos servidores estén ejecutándose:

1. Abre http://localhost:3000 en tu navegador
2. Ve a cualquier módulo que use IA (Dashboard, Learning Modules, Practice Lab)
3. Las funciones de IA deberían funcionar automáticamente
4. Revisa la consola del backend para confirmar las llamadas a la API

## 🐛 Resolución de Problemas

### Error: "API key not configured"
- Verifica que el archivo `backend/.env` contenga tu API key real
- Reinicia el servidor backend después de cambiar la API key

### Error: "Failed to fetch from proxy"
- Asegúrate que el backend esté ejecutándose en puerto 3001
- Verifica que no haya conflictos de puertos

### Error: "CORS policy"
- El backend debe estar ejecutándose para manejar CORS
- Verifica que ambos servidores estén activos

## ✅ Estado del Proyecto

- ✅ Backend proxy configurado y funcional
- ✅ Tres agentes de IA completamente integrados
- ✅ Servicios refactorizados para usar agentes específicos
- ✅ Sistema de tipos completo
- ✅ Manejo de errores robusto
- ✅ Arquitectura segura (API keys protegidas)

¡Tu aplicación EduPlanner DSA está lista para usar con IA completamente funcional! 🎉