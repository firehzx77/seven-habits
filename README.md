# Seven Habits Workbook (Static + Vercel Serverless)

## Deploy on GitHub + Vercel
1. Put these files into a GitHub repo root:
   - index.html
   - api/deepseek.js
   - vercel.json
2. In Vercel: Import the repo → Project Settings → Environment Variables:
   - `DEEPSEEK_API_KEY` = your DeepSeek API Key
3. Deploy. Open your Vercel URL and click “评估作业”.

## Local preview
- Open `index.html` directly can render UI, but AI评估需要 `/api/deepseek`，请用 Vercel Preview / `vercel dev` 运行。
