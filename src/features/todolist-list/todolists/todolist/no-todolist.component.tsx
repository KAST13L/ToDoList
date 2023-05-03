import React, {useState} from 'react';
import {JackInTheBox} from "react-awesome-reveal";

export const NoTodolistComponent: React.FC = () => {

    const [isShow, setIsShow] = useState<boolean>(false)
    const onClickLinkHandler = (e: any) => {
        e.preventDefault()
        setIsShow(() => !isShow)
    }

    return (<>
            <div className='my-5 text-3xl text-center font-thin text-zinc-500'>
                Your todo list is empty. Just add them. And feel like a<span> </span>
                <a href=''
                   className='underline'
                   onClick={onClickLinkHandler}>queen</a><span> </span>
                over your tasks.
            </div>
            {isShow && <JackInTheBox>
                <div className='max-w-[1000px]'>
                    <img
                        src="https://media1.popsugar-assets.com/files/thumbor/BhFVdQXsyqCFQma1yI6arGCfR4c/489x0:2474x1985/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2022/09/13/694/n/1922398/e5f2c3646320a46be09002.39507938_/i/Queen-Elizabeth-II-Little-Known-Facts.jpg"
                        alt="king"/>
                </div>
            </JackInTheBox>}
        </>
    );
};

