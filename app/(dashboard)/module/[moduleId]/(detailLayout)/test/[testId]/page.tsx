'use client'

import { PoseDetection } from "@/components/edu/pose-detection"
import { useSplitPath } from "@/hooks"
import apiClient from "@/services/apiService"
import { Test } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Head from "next/head"

const TestPage = () => {
    const testId = useSplitPath(4)
    
    const { data, isLoading, error } = useQuery({
        queryKey : ['getTest'],
        queryFn : () => apiClient.get<Test>(`/test/${testId}`)
    })
    
    return(
        <div className="container" style={{ padding: '20px' }}>
            <Head>
                <title>Pose Detection System</title>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" defer></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" defer></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" defer></script>
            </Head>
            <h1>Pose Detection System</h1>
            <p>AI-powered pose detection based on your custom model</p>
            <PoseDetection test={data?.data}/>
        </div>
    )
}

export default TestPage