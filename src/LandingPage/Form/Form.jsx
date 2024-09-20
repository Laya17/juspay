import React,{ useState } from "react";
import style from "./Form.module.css";
import MAryTree from "../Tree/M-AryTree";

export default function FormComponent({inputValues,StartVal,setInputValues}){

    const [presentPage,setPresentPage]=useState("start");
    const [errors,setErrors]=useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('Node-')) {
            const nodeIndex = parseInt(name.split('-')[1], 10);
            const updatedNodes = [...inputValues.Nodes];
            updatedNodes[nodeIndex] = value; 


            setInputValues({ ...inputValues, Nodes: updatedNodes });
            
        } else {
            setInputValues({ ...inputValues, [name]: value });
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setPresentPage("Next");
        console.log("InputValue")
    };

    const handleSubmit2 = (e) => {
        e.preventDefault();
        const nodeSet = new Set(inputValues.Nodes);
        if (nodeSet.size !== inputValues.Nodes.length) {
            setErrors({ form: 'Duplicate values found in nodes!' });
        } else {
            setErrors({});
            console.log(inputValues);
            console.log('Form submitted successfully');
            setPresentPage("tree");
        }
    };

    const NodeInput = () => {
        const fields = [];
        const nodeCount = parseInt(inputValues.n, 10) || 0; 
        for (let i = 0; i < nodeCount; i++) {
            fields.push(
                <InputField type={"String"} key={`Node-${i}`}  id={`Node-${i}`}  title={`Node ${i + 1}`} value={inputValues.Nodes[i] || ""} onChange={handleInputChange} />
            );
        }
        return fields;
    };

    return(
        <React.Fragment>
            {presentPage==="start" &&<form className={style.formContainer} onSubmit={handleSubmit}>
                <h1 className={style.formTitle}>JusPay Program Input</h1>
                {presentPage==="start" && 
                    StartVal.map(element=>(
                        <InputField type="number" key={element.id}  id={element.id} title={element.title} value={inputValues[element.id]}  onChange={handleInputChange} />
                    ))
                }
                <button className={style.submitButton}>Submit</button>    
            </form>}
            {presentPage==="Next" &&  <form className={style.formContainer} onSubmit={handleSubmit2}>
                {NodeInput()}
                {errors.form && <p className={style.errorMessage}>{errors.form}</p>}
                <button className={style.submitButton}>Submit</button> 
             </form>}
             {presentPage==="tree" && <MAryTree inputValues={inputValues}/>}
        </React.Fragment>
    );
}


export function InputField({type,id, title, value, onChange,error}){

    return(
        <div className={style.InputContainer}>
                <label htmlFor={id} className={style.labelText}>{title}</label>
                <div className={style.inputwrapper}>
                    <input  type={type} name={id} id={id} className={style.inputbox} value={value || ""} onChange={onChange} />
                </div>
                {error && <p className={style.errorMessage}>{error}</p>}
            </div>
    );
}