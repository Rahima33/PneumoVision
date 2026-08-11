## PneumoVision Docker Monolith

This repository is being packaged as a simplified monolith for deployment.

### What ships

- `frontend/` for the React/Vite UI
- `api/` for the FastAPI backend
- `agent/`, `gradcam/`, `preprocessing/`, and `rag/` for runtime inference
- `models/best_model_xrv_backbone.pth` as the single deployed checkpoint
- `knowledge_base/*.pdf` as build-time inputs for the persisted Chroma knowledge base

### What does not ship

- `sample_images/`
- `sample_images_by_class/`
- `notebooks_archive/`
- extra training checkpoints in `models/`
- raw knowledge-base PDFs at runtime after the Docker build finishes
- generated artifacts like `agent_outputs/`

### Runtime rule

Only keep assets that are needed to answer one uploaded X-ray at runtime. Everything else should stay out of the shipped artifact or be treated as build-time data.

### Current production shape

- Frontend talks to one FastAPI app
- FastAPI owns upload, inference, Grad-CAM, retrieval, and report assembly
- Groq handles the LLM calls
- Chroma is generated during the Docker build and persisted into the image

### Docker build

The Docker image builds the React frontend, installs the Python runtime dependencies, generates `rag/chroma_db/` from the tracked PDFs, and serves the app with FastAPI. The container uses Render's `$PORT` when provided and falls back to `8000` locally.

```powershell
docker build -t pneumovision:monolith .
docker run --env-file .env -p 8000:8000 pneumovision:monolith
```

### Render deployment

`render.yaml` defines a Docker web service with `/health` as the health check. Set `GROQ_API_KEY` in Render before deploying. `HF_TOKEN` is optional but can help avoid Hugging Face rate limits during model downloads.
