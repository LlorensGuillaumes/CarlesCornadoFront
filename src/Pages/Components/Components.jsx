import React, { useEffect, useState } from "react";
import "./Components.css";
import api from "../../Shared/API/api";
import arraySort from "../../Shared/TreatyArray/Treatyarray";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";
import agregar from "../../Images/icons/agregar.png";
import editar from "../../Images/icons/editar.png";
import TreatyArray from "../../Shared/TreatyArray/Treatyarray";

const Components = () => {
const [componentsData, setComponentsData] = useState([]);
const [providersData, setprovidersData] = useState([]);
const [processesData, setProcessesData] = useState([]);
const [componentDetailVisible, setComponentDetailVisible] = useState(false);
const [componentSelected, setComponentSelected] = useState(null);

const [providersList, setProviderList] = useState([]);
const [processesList, setProcessesList] = useState([]);
const [equivalencesList, setEquivalencesList] = useState([]);

const [providersDataFiltered, setProviderDataFiltered] = useState([]);
const [processesDataFiltered, setProcessesDataFiltered] = useState([]);
const [equivalencesDataFiltered, setEquivalencesDataFiltered] = useState([]);

const [isEdit, setIsEdit] = useState(false);
const [isNew, setIsNew] = useState(false);

const [componentReference, setComponentReference] = useState();
const [sanitaryComponentReference, setSanitaryComponentReference] =
useState();
const [description, setDescription] = useState();

useEffect(() => {
getComponents();
}, []);

const getEditData = () => {
getProcesses();
getProviders();
};

const getComponents = () => {
api
    .get("/components")
    .then((response) => {
    setComponentsData(
        arraySort.alphabetical(response, "componentReference")
    );
    })
    .catch((error) => {
    console.log(error);
    });
};
const getProviders = () => {
api
    .get("/providers")
    .then((response) => {
    setprovidersData(arraySort.alphabetical(response, "name"));
    })
    .catch((error) => {
    console.log(error);
    });
};

const getProcesses = () => {
api
    .get("/processes")
    .then((response) => {
    setProcessesData(arraySort.alphabetical(response, "name"));
    })
    .catch((error) => {
    console.log(error);
    });
};

useEffect(()=>{
    setProviderDataFiltered([...providersData]);
    setProcessesDataFiltered([...processesData]);
    setEquivalencesDataFiltered([...componentsData]);

},[providersData, processesData, componentsData]);


const btnClose = () => {
setComponentDetailVisible(false);
setIsEdit(false);
setIsNew(false);
};

const componentRelations = (event, relationId, relationName, item) => {
const isChecked = event;
const relation = {
    id: relationId,
    name: relationName,
};

switch (item) {
    case "provider":
    isChecked
        ? 
        setProviderList((prevList) => [...prevList, relation])
        : setProviderList((prevList) =>
            prevList.filter((item) => item.id !== relationId)
        );
    break;
    case "process":
    isChecked
        ? setProcessesList((prevList) => [...prevList, relation])
        : setProcessesList((prevList) =>
            prevList.filter((item) => item.id !== relationId)
        );
    break;
    case "component":
    isChecked
        ? setEquivalencesList((prevList) => [...prevList, relation])
        : setEquivalencesList((prevList) =>
            prevList.filter((item) => item.id !== relationId)
        );
    break;
    default:
    console.log("error");
}

};

const selectComponent = (component) => {
    setComponentSelected(component)
    const equivalences = component.equivalences;
    const processes = component.processes;
    const providers = component.providers;

    setProviderList([]);
    setProcessesList([]);
    setEquivalencesList([]);

    for (const equivalence of equivalences) {
        componentRelations(true, equivalence._id, equivalence.componentReference, 'component');
    };
    for (const process of processes) {
        componentRelations(true, process._id, process.name, 'process');
    };
    for (const provider of providers) {
        componentRelations(true, provider._id, provider.name, 'provider');
    }
}

const newComponent = () => {
    const newComponent = {
        componentReference: componentReference,
        sanitaryComponentReference: sanitaryComponentReference,
        description: description,
        equivalences: TreatyArray.dropDuplicatesAndEmpty(equivalencesList.map((item)=>(item.id))),
        processes: TreatyArray.dropDuplicatesAndEmpty(processesList.map((item)=>(item.id))),
        providers: TreatyArray.dropDuplicatesAndEmpty(providersList.map((item)=>(item.id))),
    }

    {isNew ? 
        api
        .post('/components/create', newComponent)
        .then((response)=>{
            getComponents()
        })

        :

        api
        .put(`/components/edit/${componentSelected._id}`, newComponent)
        .then((response)=>{
            getComponents()
        })
}
setComponentDetailVisible(false);
setComponentSelected(null);
    
    }


useEffect(()=>{
    if(componentSelected){
setComponentReference(componentSelected.componentReference);
setSanitaryComponentReference(componentSelected.sanitaryComponentReference)
setDescription(componentSelected.description)

    }

},[componentSelected])

const fnFilter = (item, value) => {
switch (item) {
    case 'provider':
    const filteredProviders = providersData.filter(provider =>
        provider.name.toLowerCase().includes(value.toLowerCase())
    );
    setProviderDataFiltered(filteredProviders);
    break;
    case 'process':
    const filteredProcesses = processesData.filter(process =>
        process.name.toLowerCase().includes(value.toLowerCase())
    );
    setProcessesDataFiltered(filteredProcesses);
    break;
    case 'component':
    const filteredComponents = componentsData.filter(component =>
        component.componentReference.toLowerCase().includes(value.toLowerCase()) || component.description.toLowerCase().includes(value.toLowerCase())
    );
    setEquivalencesDataFiltered(filteredComponents);
    break;
    default:
    console.log('error');
}
};


return (
<div className="component">
    <h1>COMPONENTS</h1>
    <div className="component-container">
    {componentsData &&
        componentsData.length > 0 &&
        componentsData.map((component, index) => (
        <div
            key={index}
            className="components-container_component link"
            onClick={() => {
            selectComponent(component);
            setComponentDetailVisible(true);
            }}
        >
            <p>{component.componentReference}</p>
            <p>{component.sanitaryComponentReference}</p>
            <p>{component.description}</p>
        </div>
        ))}
    <h2
        className="link"
        onClick={() => {
        setIsNew(true);
        setIsEdit(false);
        setComponentDetailVisible(true);
        getEditData();
        setProviderList([]);
        setEquivalencesList([]);
        setProcessesList([]);
        }}
    >
    <div className="optionBtn">
    <img src={agregar} alt="agregar" title="Nou component"/>
    </div>
    </h2>
    {componentDetailVisible && (
        <div className="">
        {isEdit || isNew ? (
            <div className="component-detail-container">
            {isNew ? <h1>NOU COMPONENT</h1> : <h1>MODIFICAR COMPONENT</h1>}
            <input
                defaultValue={
                !isNew ? componentSelected.componentReference : ""
                }
                placeholder="Referència"
                onChange={(e) => {
                setComponentReference(e.target.value);
                }}
                className="text_input"
            />
            <input
                defaultValue={
                !isNew ? componentSelected.sanitaryComponentReference : ""
                }
                placeholder="Referència sanitària"
                onChange={(e) => {
                setSanitaryComponentReference(e.target.value);
                }}
                className="text_input"
            />
            <input
                defaultValue={!isNew ? componentSelected.description : ""}
                placeholder="nom"
                onChange={(e) => {
                setDescription(e.target.value);
                }}
                className="text_input"
            />
            <div className="headboard">
                <p>Proveidors</p>
                <p>Processos</p>
                <p>Equivalències</p>
            </div>
            <div className="headbord-filter">
                <input placeholder="buscar proveïdor" onChange={(e)=>fnFilter('provider', e.target.value)}/>
                <input placeholder="buscar procés" onChange={(e)=>fnFilter('process', e.target.value)}/>
                <input placeholder="buscar ref. o nom" onChange={(e)=>fnFilter('component', e.target.value)}/>
            </div>

            {isNew ? (
                <div className="optionsSelector">
                <div className="list-container">
                    {providersDataFiltered &&
                    providersDataFiltered.length > 0 &&
                    providersDataFiltered.map((provider, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            onChange={(e) => {
                            componentRelations(
                                e.target.checked,
                                provider._id,
                                provider.name,
                                "provider"
                            );
                            }}
                        />
                        <p>{provider.name}</p>
                        </div>
                    ))}
                </div>
                <div className="list-container">
                    {processesDataFiltered &&
                    processesDataFiltered.length > 0 &&
                    processesDataFiltered.map((process, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            onChange={(e) => {
                            componentRelations(
                                e.target.checked,
                                process._id,
                                process.name,
                                "process"
                            );
                            }}
                        />
                        <p>{process.name}</p>
                        </div>
                    ))}
                </div>
                <div className="list-container">
                    {equivalencesDataFiltered &&
                    equivalencesDataFiltered.length > 0 &&
                    equivalencesDataFiltered.map((component, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            onChange={(e) => {
                            componentRelations(
                                e.target.checked,
                                component._id,
                                component.componentReference,
                                "component"
                            );
                            }}
                        />
                        <p>{component.componentReference}</p>
                        </div>
                    ))}
                </div>
                </div>
            ) : 
        
        


            <div className="optionsSelector">
                <div className="list-container">
                    {providersDataFiltered &&
                        providersDataFiltered.length > 0 &&
                        providersDataFiltered.map((provider, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            checked = {providersList.some((item)=>item.id === provider._id)}
                            onChange={(e) => {
                            componentRelations(
                                e.target.checked,
                                provider._id,
                                provider.name,
                                "provider"
                            );
                            }}
                        />
                        <p>{provider.name}</p>
                        </div>
                    ))}
                </div>
                <div className="list-container">
                    {processesDataFiltered &&
                        processesDataFiltered.length > 0 &&
                        processesDataFiltered.map((process, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            checked = {processesList.some((item)=>item.id === process._id)}
                            onChange={(e) => {
                            componentRelations(
                                e.target.checked,
                                process._id,
                                process.name,
                                "process"
                            );
                            }}
                        />
                        <p>{process.name}</p>
                        </div>
                    ))}
                </div>
                <div className="list-container">
                    {equivalencesDataFiltered &&
                        equivalencesDataFiltered.length > 0 &&
                        equivalencesDataFiltered.map((component, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            checked = {equivalencesList.some((item)=>item.id === component._id)}
                            onChange={(e) => {
                            componentRelations(
                                e.target.checked,
                                component._id,
                                component.componentReference,
                                "component"
                            );
                            }}
                        />
                        <p>{component.componentReference}</p>
                        </div>
                    ))}
                </div>
                </div>
        
        
        
        
        
        }

            <h2>SELECCIONATS</h2>
            <div className="optionsSelector">
                <div className="list-container">
                {providersList &&
                    providersList.length > 0 &&
                    providersList.map((provider, index) => (
                    <div className="list-check" key={index}>
                        <p>{provider.name}</p>
                    </div>
                    ))}
                </div>
                <div className="list-container">
                {processesList &&
                    processesList.length > 0 &&
                    processesList.map((process, index) => (
                    <div className="list-check" key={index}>
                        <p>{process.name}</p>
                    </div>
                    ))}
                </div>
                <div className="list-container">
                {equivalencesList &&
                    equivalencesList.length > 0 &&
                    equivalencesList.map((component, index) => (
                    <div className="list-check" key={index}>
                        <p>{component.name}</p>
                    </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="optionBtn">
                <img
                    src={aceptar}
                    alt="aceptar"
                    className="link"
                    title="Guardar"
                    onClick={()=>{newComponent()}}
                />
                </div>
                <div className="optionBtn">
                <img
                    src={cancelar}
                    alt="cancelar"
                    className="link"
                    title="Cancelar"
                    onClick={() => {
                    btnClose();
                    }}
                />
                </div>
            </div>
            </div>
        ) : (
            <div className="component-detail-container">
            <div className="optionBtn link">
            <img src={editar} alt="editar" title="Editar"   onClick={() => {
                setIsEdit(true);
                setIsNew(false);
                getEditData();
                }}/>
            </div>
            <div className="optionBtn link">
            <img src={cancelar} alt="cancelar" title="Cancelar"   onClick={() => {
                btnClose();
                }}/>
            </div>
            <h1>{componentSelected.componentReference}</h1>

            <p>
                Referència sanitària:{" "}
                {componentSelected.sanitaryComponentReference}
            </p>
            <p>Nom: {componentSelected.description}</p>
            <h2>Equivalències</h2>
            {componentSelected.equivalences &&
                componentSelected.equivalences.length > 0 &&
                componentSelected.equivalences.map((item, index) => (
                <div key={index}>
                    <p>{item.componentReference}</p>
                </div>
                ))}
            <h2>Proveidors</h2>
            {componentSelected.providers &&
                componentSelected.providers.length > 0 &&
                componentSelected.providers.map((item, index) => (
                <div key={index}>
                    <p>{item.name}</p>
                </div>
                ))}
            <h2>Processos</h2>
            {componentSelected.processes &&
                componentSelected.processes.length > 0 &&
                componentSelected.processes.map((item, index) => (
                <div key={index}>
                    <p>{item.name}</p>
                </div>
                ))}
            </div>
        )}
        </div>
    )}
    </div>
</div>
);
};
export default Components;
