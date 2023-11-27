import React, { useEffect, useState } from "react";
import "./Components.css";
import api from "../../Shared/API/api";
import arraySort from "../../Shared/TreatyArray/Treatyarray";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";
import agregar from "../../Images/icons/agregar.png";
import editar from "../../Images/icons/editar.png";
import papelera from "../../Images/icons/papelera.png";
import TreatyArray from "../../Shared/TreatyArray/Treatyarray";
import DeleteConfirm from "../DeleteConfirm/DeleteConfirm";
import ChangeCurrency from "../ChangeCurrency/ChangeCurrency";

const Components = () => {
const [componentsData, setComponentsData] = useState([]);
const [providersData, setprovidersData] = useState([]);
const [processesData, setProcessesData] = useState([]);
const [componentDetailVisible, setComponentDetailVisible] = useState(false);
const [componentSelected, setComponentSelected] = useState(null);
const [showConfirm, setShowConfirm] = useState(false);
const [showChageCurrency, setShowChangeCurrency] = useState(false);
const [priceCalculate, setPriceCalculate] = useState([{name:"", price: "", currency:""}]);
const [priceToChageCurrency, setPriceToChangeCurrency] = useState({name:'', value: '', currency:''})
const [finalPrice, setFinalPrice] = useState();

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
const [price, setPrice] = useState();
const [providerPrice, setProviderPrice] = useState({
idProvider: null,
price: null,
currency: null,
});
const [priceSale, setPriceSale] = useState();

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

useEffect(() => {
setProviderDataFiltered([...providersData]);
setProcessesDataFiltered([...processesData]);
setEquivalencesDataFiltered([...componentsData]);
}, [providersData, processesData, componentsData]);

const btnClose = () => {
setComponentDetailVisible(false);
setComponentSelected({});
setIsEdit(false);
setIsNew(false);
};

const componentRelations = (event, relations, relationName, item) => {
const isChecked = event;
const relation = {
    id: relations._id,
    name: relationName,
    price:
    item === "provider"
        ? providerPrice.idProvider === relations._id
        ? providerPrice.price
        : null
        : relations.price,
    currency: providerPrice.currency,
};

switch (item) {
    case "provider":
    isChecked
        ? setProviderList((prevList) => [...prevList, relation])
        : setProviderList((prevList) =>
            prevList.filter((item) => item.id !== relations._id)
        );
    break;
    case "process":
    isChecked
        ? setProcessesList((prevList) => [...prevList, relation])
        : setProcessesList((prevList) =>
            prevList.filter((item) => item.id !== relations._id)
        );
    break;
    case "component":
    isChecked
        ? setEquivalencesList((prevList) => [...prevList, relation])
        : setEquivalencesList((prevList) =>
            prevList.filter((item) => item.id !== relations._id)
        );
    break;
    default:
    console.log("error");
}
};

const selectComponent = (component) => {
setComponentSelected(component);
const equivalences = component.equivalences;
const processes = component.processes;
const providers = component.providers;

setProviderList([]);
setProcessesList([]);
setEquivalencesList([]);

for (const equivalence of equivalences) {
    componentRelations(
    true,
    equivalence._id,
    equivalence.componentReference,
    "component"
    );
}
for (const process of processes) {
    componentRelations(true, process._id, process.name, "process");
}
for (const provider of providers) {
    componentRelations(true, provider._id, provider.name, "provider");
}
};

const newComponent = () => {
const newComponent = {
    componentReference: componentReference,
    sanitaryComponentReference: sanitaryComponentReference,
    description: description,
    price: price,
    priceSale: priceSale,
    equivalences: TreatyArray.dropDuplicatesAndEmpty(
    equivalencesList.map((item) => item.id)
    ),
    processes: TreatyArray.dropDuplicatesAndEmpty(
    processesList.map((item) => item.id)
    ),
    providers: providersList.map((item) => ({
    providers: item.id,
    price: item.price,
    })),
};

{
    isNew
    ? api.post("/components/create", newComponent).then((response) => {
        getComponents();
        })
    : api
        .put(`/components/edit/${componentSelected._id}`, newComponent)
        .then((response) => {
            getComponents();
        });
}
setComponentDetailVisible(false);
setComponentSelected(null);
};

useEffect(() => {
if (componentSelected) {
    setComponentReference(componentSelected.componentReference);
    setSanitaryComponentReference(
    componentSelected.sanitaryComponentReference
    );
    setDescription(componentSelected.description);
}
}, [componentSelected]);

const fnFilter = (item, value) => {
switch (item) {
    case "provider":
    const filteredProviders = providersData.filter((provider) =>
        provider.name.toLowerCase().includes(value.toLowerCase())
    );
    setProviderDataFiltered(filteredProviders);
    break;
    case "process":
    const filteredProcesses = processesData.filter((process) =>
        process.name.toLowerCase().includes(value.toLowerCase())
    );
    setProcessesDataFiltered(filteredProcesses);
    break;
    case "component":
    const filteredComponents = componentsData.filter(
        (component) =>
        component.componentReference
            .toLowerCase()
            .includes(value.toLowerCase()) ||
        component.description.toLowerCase().includes(value.toLowerCase())
    );
    setEquivalencesDataFiltered(filteredComponents);
    break;
    default:
    console.log("error");
}
};

const dropComponent = (confirm) => {
if (confirm) {
    api
    .put(`/components/delete/${componentSelected._id}`)
    .then((response) => {
        getComponents();
        btnClose();
    });
}
setShowConfirm(false);
};

const fnCalculatePriceCurrency = (isChecked, name, price, currency) => {
    if(!isChecked){
        const newPriceCalculate = priceCalculate.filter((item)=>(item.name !== name));
            setPriceCalculate(newPriceCalculate.filter((item)=>(item.name !== '' && item.price!=='' && item.currency!=='')));  

        
    }else{
        if(currency !== "€") {
        setPriceToChangeCurrency({name: name, value:price, currency:currency})
        setShowChangeCurrency(true);
    } else{
        fnCalculatePrice(name, price)
    }
    }
    
}
const fnCalculatePrice = (name, price) => {
    const newItemPrice = {
        name: name,
        price: price,
        currency: '€',
    }
    setPriceCalculate([...priceCalculate, newItemPrice]);
}

useEffect(() => {
    let acumulador = 0;
    for (const item of priceCalculate) {
        const itemPrice = parseFloat(item.price);
        if (!isNaN(itemPrice)) {
            acumulador += itemPrice;
        }
    }
    const roundedTotal = acumulador.toFixed(2);
    setFinalPrice(roundedTotal);

}, [priceCalculate]);





console.log(providersList);
console.log(componentSelected);
return (
<div className="component">
    <div className="optionBtn">
    <img
        className="link"
        src={agregar}
        alt="agregar"
        title="Nou component"
        onClick={() => {
        setIsNew(true);
        setIsEdit(false);
        setComponentDetailVisible(true);
        getEditData();
        setProviderList([]);
        setEquivalencesList([]);
        setProcessesList([]);
        }}
    />
    </div>
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

    {componentDetailVisible && (
        <div className="">
        {isEdit || isNew ? (
            <div className="component-detail-container">
            {isNew ? <h1>NOU COMPONENT</h1> : <h1>MODIFICAR COMPONENT</h1>}
            <div className="buttons-box">
                <div className="optionBtn">
                <img
                    src={aceptar}
                    alt="aceptar"
                    className="link"
                    title="Guardar"
                    onClick={() => {
                    newComponent();
                    }}
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
            <div className="productsItemContainer">
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
                <input
                defaultValue={!isNew ? componentSelected.priceSale : ""}
                placeholder="preu Venta"
                onChange={(e) => {
                    setPriceSale(e.target.value);
                }}
                className="text_input"
                />
            </div>
            <div className="headboard">
                <p>Proveidors</p>
                <p>Processos</p>
                <p>Equivalències</p>
            </div>
            <div className="headbord-filter">
                <input
                placeholder="buscar proveïdor"
                onChange={(e) => fnFilter("provider", e.target.value)}
                />
                <input
                placeholder="buscar procés"
                onChange={(e) => fnFilter("process", e.target.value)}
                />
                <input
                placeholder="buscar ref. o nom"
                onChange={(e) => fnFilter("component", e.target.value)}
                />
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
                                provider,
                                provider.name,
                                "provider"
                            );
                            }}
                        />
                        <p className="component_provider-item">
                            {provider.name}
                        </p>
                        <input
                            id="componentProviderPrice"
                            type="text"
                            placeholder="Preu"
                            onChange={(e) => {
                            setProviderPrice({
                                idProvider: provider._id,
                                price: e.target.value,
                                currency: provider.currency,
                            });
                            }}
                        />
                        <p>{provider.currency}</p>
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
                                process,
                                process.name,
                                "process"
                            );
                            }}
                        />
                        <p className="component_process-item">
                            {process.name}
                        </p>
                        <p id="componentProviderPrice">{process.price}€</p>
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
                                component,
                                component.componentReference,
                                "component"
                            );
                            }}
                        />
                        <p className="component_equivalence-item">
                            {component.componentReference}
                        </p>
                        </div>
                    ))}
                </div>
                </div>
            ) : (
                <div className="optionsSelector">
                <div className="list-container">
                    {providersDataFiltered &&
                    providersDataFiltered.length > 0 &&
                    providersDataFiltered.map((provider, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            checked={providersList.some(
                            (item) => item.id === provider._id
                            )}
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
                            checked={processesList.some(
                            (item) => item.id === process._id
                            )}
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
                            checked={equivalencesList.some(
                            (item) => item.id === component._id
                            )}
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
            )}

            <h2>SELECCIONATS</h2>
            <div className="optionsSelector">
                <div className="list-container">
                {providersList &&
                    providersList.length > 0 &&
                    providersList.map((provider, index) => (
                    <div className="list-check" key={index}>
                        <p className="component_provider-item">
                        {provider.name}
                        </p>
                        <p id="componentProviderPrice">{provider.price}</p>
                        <p>{provider.currency}</p>
                    </div>
                    ))}
                </div>
                <div className="list-container">
                {processesList &&
                    processesList.length > 0 &&
                    processesList.map((process, index) => (
                    <div className="list-check" key={index}>
                        <p>{process.name}</p>
                        <p>{process.price}</p>
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
            </div>
        ) : (
            <div className="component-detail-container">
            <div className="buttons-box">
                <div className="optionBtn link">
                <img
                    src={editar}
                    alt="editar"
                    title="Editar"
                    onClick={() => {
                    setIsEdit(true);
                    setIsNew(false);
                    getEditData();
                    }}
                />
                </div>
                <div className="optionBtn">
                <img
                    src={papelera}
                    alt="eliminar"
                    className="link"
                    title="Eliminar"
                    onClick={() => {
                    setShowConfirm(true);
                    }}
                />
                </div>
                <div className="optionBtn link">
                <img
                    src={cancelar}
                    alt="cancelar"
                    title="Cancelar"
                    onClick={() => {
                    btnClose();
                    }}
                />
                </div>
            </div>
            <div className="detail_calculatePrice">
            <div className="process_detail">
            <h1>{componentSelected.description}</h1>
            <h1>
                {componentSelected.componentReference}{" "}
                {componentSelected.sanitaryComponentReference &&
                `(${componentSelected.sanitaryComponentReference})`}
            </h1>
            <p>Preu venta: {componentSelected.priceSale} €</p>

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
                <div key={index} className="components_provider_list">
                <input type="checkbox" onChange={(e)=>{fnCalculatePriceCurrency(e.target.checked, item.providers.name, item.price, item.providers.currency )}}/>
                    <p>
                    {item.providers.name} {item.price} {item.providers.currency}
                    </p>
                </div>
                ))}

            <h2>Processos</h2>
            {componentSelected.processes &&
            componentSelected.processes.length > 0 &&
            componentSelected.processes.map((item, index) => (
            <div key={index} className="processes_price_input">
                <input type="checkbox" onChange={(e)=>{fnCalculatePriceCurrency(e.target.checked, item.name, item.price, item.currency )}}/>
                <p>{item.name} {item.price} {item.currency}</p>
            </div>
            ))}
            </div>
            <div className="calculate_price">
            <h3>Preu de cost: {finalPrice} €</h3>
            <p>Els camps de benefici i Despeses d'empresa no fan res, pero veuràs que si selecciones proveidors i procesos l'import canvia</p>
            <input type="text" placeholder="Despeses empresa"/>
            <input type="text" placeholder="% benefici"/>
            {priceCalculate && priceCalculate.length > 0 && priceCalculate.map((item, index)=>(
                <div key={index}> 
                <p>{item.name} {item.price} {item.currency}</p>
                </div>
            ))}
            
            </div>
            </div>

            
            </div>
        )}
        {showConfirm && (
            <DeleteConfirm
            text={componentSelected.componentReference}
            onAceptar={() => dropComponent(true)}
            onCancelar={() => dropComponent(false)}
            />
        )}
        {showChageCurrency && (
            <ChangeCurrency
            objectToChange={priceToChageCurrency}
            onAceptar={(data) => {
                fnCalculatePrice(data.name, data.value)
                setShowChangeCurrency(false)
            }}
            onCancelar={() => setShowChangeCurrency(false)}
            />
        )}
        </div>
    )}
    </div>
</div>
);
};
export default Components;
