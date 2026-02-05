'use client';

import Typewriter from 'typewriter-effect';
import agents from '@/services/agents.json';
import skills from '@/services/skills.json';
import workflows from '@/services/workflows.json';


export default function Typing() {
    return (
        <Typewriter
            options={{
                strings: [`${agents.length}+ 智能体`, `${skills.length}+ 技能`, `${workflows.length}+ 工作流`, '开源'],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
            }}
        />
    )
}
