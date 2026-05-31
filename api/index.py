from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI, AsyncOpenAI
from agents import Agent, OpenAIChatCompletionsModel, Runner, trace, input_guardrail, GuardrailFunctionOutput, function_tool
from openai.types.responses import ResponseTextDeltaEvent
from pydantic import BaseModel
import asyncio
import re
from typing import List
import json
import os

load_dotenv(override=True)

groq_api_key = os.getenv('GROQ_API_KEY')

app = FastAPI()

class QuizRequest(BaseModel):
    topic: str

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Groq_client = AsyncOpenAI(api_key = groq_api_key, base_url="https://api.groq.com/openai/v1")
groq_model = OpenAIChatCompletionsModel(model= "openai/gpt-oss-20b", openai_client=Groq_client)

@app.get("/api")
async def root():
    return {"message": "hello"}

@app.get("/question")
async def question():
    return {"message": "question route"}

@app.post("/quizer")
async def quizer(request: QuizRequest) :
    userTopic = request.topic

    managerinstuction = """
    You are a manager agent.

    Output:
    - Final output must contain exactly 10 questions in ONE JSON ARRAY
    - Output is from `questionAgent` as a valid JSON object

    Rules:
    - Never stop after tool output.
    - Never return intermediate output.
    - Always complete the full workflow.
    - Do not ask questions.
    
    """

    quizeInstruction = """
        You are a quiz generation agent.

        You will receive exactly 5 topics.

        Your task:
        - Generate EXACTLY 2 MCQ questions for EACH topic.
        - Total questions must be EXACTLY 10.
        - Every question must have:
        - Question
        - 4 Options
        - Answer (1-4 index)
        - Explanation (in 3 words)

        STRICT RULES:
        - Return ONLY VALID JSON.
        - Return ONLY ONE JSON ARRAY.
        - No markdown.
        - No code block.
        - No comments.
        - No extra text.
        - Do not stop early.
        - Do not summarize.
        - Do not group by topic.

        Required STRICTLY Follow BELOW format:

        {
            "Question": "What is JVM?",
            "Options": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
            ],
            "Answer": 2,
            "Explanation": "JVM executes Java bytecode and provides platform independence."
        }
    """ 

    questionAgent = Agent(name="questionAgent", instructions=quizeInstruction, model=groq_model, handoff_description="Question generated for given topics.")

    managerAgent = Agent(name="managerAgent", instructions=managerinstuction, model=groq_model, tools=[subTopicProviderTool, topicSelectorTool], handoffs=[questionAgent])

    result = await Runner.run(managerAgent, f'Generate for {userTopic}')

    cleaned = re.sub(
        r"<think>.*?</think>",
        "",
        result.final_output,
        flags=re.DOTALL
    ).strip()
    print(cleaned)
    return json.loads(cleaned)

@function_tool
async def topicSelectorTool(topics: List[str]) :
    topicSelector = """
    Your task is to select random 5 topics from given list of topics {topics}.

    Return ONLY JSON array of topic only NO explanation.
    """

    topicSelectoragent = Agent(
        name="TopicSelectorAgent",
        instructions=topicSelector,
        model=groq_model
    )

    result = await Runner.run(
        topicSelectoragent,
        f"Select from  {topics}"
    )

    cleaned = re.sub(
        r"<think>.*?</think>",
        "",
        result.final_output,
        flags=re.DOTALL
    ).strip()

    print(f'selected 5 topics : {cleaned}')

    return cleaned

@function_tool
async def subTopicProviderTool(topic: str):

    subtopicprovider = """
    your task is to generate 10 sub topics related to given topic {topic}.
    Generate exactly 10 sub topics, should be a single word.
    Each topic should be in such a way it deepen the main topic.
    Return ONLY JSON array.
    """

    subtopicagent = Agent(
        name="SubTopicAgent",
        instructions=subtopicprovider,
        model=groq_model
    )

    result = await Runner.run(
        subtopicagent,
        f"Generate subtopics for {topic}"
    )

    cleaned = re.sub(
        r"<think>.*?</think>",
        "",
        result.final_output,
        flags=re.DOTALL
    ).strip()

    return cleaned