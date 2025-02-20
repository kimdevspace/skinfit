from fastapi import FastAPI
from ocr.ocr_app import app as ocr_app
from recommendation.rec_app import app as rec_app
# from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # 개발 환경에서는 모든 출처 허용
#     allow_credentials=True,
#     allow_methods=["*"],  # 모든 HTTP 메서드 허용
#     allow_headers=["*"],  # 모든 헤더 허용
# )

# # 각각의 애플리케이션을 서브 경로에 마운트

app.mount("/ocr", ocr_app)
app.mount("/recommend", rec_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
