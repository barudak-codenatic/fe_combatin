'use client'

import { CustomButton } from "@/components/common"
import { StepProgress } from "@/components/edu"
import { PoseDetection } from "@/components/edu/pose-detection"
import { useSplitPath } from "@/hooks"
import apiClient from "@/services/apiService"
import { Test } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Head from "next/head"
import { useState } from "react"

const TestPage = () => {
    const testId = useSplitPath(4)

    const [isStart, setStart] = useState(false)
    
    const { data, isLoading, error } = useQuery({
        queryKey : ['getTest'],
        queryFn : () => apiClient.get<Test>(`/test/${testId}`)
    })
    if (data) {
        return(
            <div className="container" style={{ padding: '20px' }}>
                <Head>
                    <title>Pose Detection System</title>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" defer></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" defer></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" defer></script>
                </Head>
                {isStart?
                    <>
                        <h1>Pose Detection System</h1>
                        <p>AI-powered pose detection based on your custom model</p>
                        <PoseDetection test={data.data}/>
                    </>:
                    <div>
                        <h3 className="font-bold text-2xl">{data.data.title}</h3>
                        <p className="text-lg my-2">{data.data.description}</p>
                        <div className="my-10">
                            <StepProgress
                                steps={data.data.config}
                                currentStep={data.data.config.length}
                            />
                        </div>
                        <div className="flex justify-center">
                            <CustomButton
                                title="Mulai"
                                onClick={() => setStart(true)}
                            />
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default TestPage