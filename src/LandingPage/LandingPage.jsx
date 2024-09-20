import style from "./LandingPage.module.css";
import FormComponent from "./Form/Form";
import { useState } from "react";
export default function LandingPage(){
    
    const [inputValues,setInputValues] =useState({
        n:"",
        m:"",
        op:"",
        Nodes:[],
        Operations:[]
    });

    const StartVal=[{
        title:"No of nodes",
        id:"n"
        },
        {
            title:"No of Children",
            id:"m"
        },
        {
            title:"No of Operations",
            id:"op"
        }];


    return(
        <div className={style.LandingPageContainer}>  

            <FormComponent inputValues={inputValues} StartVal={StartVal} setInputValues={setInputValues}/>
        
        
        </div>
    );
}