import React, { useEffect, useState } from "react";
import "./Products.css";
import api from "../../Shared/API/api";
import arraySort from "../../Shared/TreatyArray/Treatyarray";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";
import agregar from "../../Images/icons/agregar.png";
import editar from "../../Images/icons/editar.png";
import papelera from "../../Images/icons/papelera.png";
import TreatyArray from "../../Shared/TreatyArray/Treatyarray";
import DeleteConfirm from "../DeleteConfirm/DeleteConfirm";

const Products = () => {
const [productsData, setProductsData] = useState([]);
const [componentsData, setComponentsData] = useState([]);
const [providersData, setprovidersData] = useState([]);
const [processesData, setProcessesData] = useState([]);
const [componentDetailVisible, setComponentDetailVisible] = useState(false);
const [productSelected, setProductSelected] = useState(null);
const [showConfirm, setShowConfirm] = useState(false);

const [providersList, setProviderList] = useState([]);
const [processesList, setProcessesList] = useState([]);
const [componentsList, setComponentsList] = useState([]);
const [equivalencesList, setEquivalencesList] = useState([]);

const [providersDataFiltered, setProviderDataFiltered] = useState([]);
const [processesDataFiltered, setProcessesDataFiltered] = useState([]);
const [componentsDataFiltered, setComponentsDataFiltered] = useState([]);
const [equivalencesDataFiltered, setEquivalencesDataFiltered] = useState([]);

const [isEdit, setIsEdit] = useState(false);
const [isNew, setIsNew] = useState(false);

const [productReference, setProductReference] = useState();
const [sanitaryProductReference, setSanitaryProductReference] = useState();
const [description, setDescription] = useState();
const [price, setPrice] = useState();
const [priceSale, setPriceSale] = useState();

useEffect(() => {
getProducts();
}, []);

const getEditData = () => {
getComponents();
getProcesses();
getProviders();
};

const getProducts = () => {
api.get("/products").then((response) => {
    setProductsData(arraySort.alphabetical(response, "productReference"));
});
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
setComponentsDataFiltered([...componentsData]);
setEquivalencesDataFiltered([...productsData]);
}, [providersData, processesData, componentsData]);

const btnClose = () => {
setComponentDetailVisible(false);
setProductSelected({});
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
        ? setProviderList((prevList) => [...prevList, relation])
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
        ? setComponentsList((prevList) => [...prevList, relation])
        : setComponentsList((prevList) =>
            prevList.filter((item) => item.id !== relationId)
        );
    break;
    case "product":
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

useEffect(() => {
if (productSelected) {
    const equivalences = productSelected.equivalences || [];
    const processes = productSelected.processes || [];
    const providers = productSelected.providers || [];
    const components = productSelected.components || [];

    setProviderList([]);
    setProcessesList([]);
    setEquivalencesList([]);
    setComponentsList([]);

    for (const equivalence of equivalences) {
    componentRelations(
        true,
        equivalence._id,
        equivalence.productReference,
        "product"
    );
    }
    for (const process of processes) {
    componentRelations(true, process._id, process.name, "process");
    }
    for (const provider of providers) {
    componentRelations(true, provider._id, provider.name, "provider");
    }
    for (const component of components) {
    componentRelations(
        true,
        component._id,
        component.componentReference,
        "component"
    );
    }
}
}, [productSelected]);

const selectComponent = (product) => {
setProductSelected(product);
};

const newProduct = () => {
const newProduct = {
    productReference: productReference,
    sanitaryProductReference: sanitaryProductReference,
    description: description,
    components: TreatyArray.dropDuplicatesAndEmpty(
    componentsList.map((item) => item.id)
    ),
    processes: TreatyArray.dropDuplicatesAndEmpty(
    processesList.map((item) => item.id)
    ),
    providers: TreatyArray.dropDuplicatesAndEmpty(
    providersList.map((item) => item.id)
    ),
    equivalences: TreatyArray.dropDuplicatesAndEmpty(
    equivalencesList.map((item) => item.id)
    ),
    price: price,
    priceSale: priceSale
};
{
    isNew
    ? api.post("/products/create", newProduct).then((response) => {
        getProducts();
        })
    : api
        .put(`/products/edit/${productSelected._id}`, newProduct)
        .then((response) => {
            getProducts();
        });
}
setComponentDetailVisible(false);
setProductSelected([]);
setIsEdit(false);
};

useEffect(() => {
if (productSelected) {
    setProductReference(productSelected.productReference);
    setSanitaryProductReference(productSelected.sanitaryProductReference);
    setDescription(productSelected.description);
}
}, [productSelected]);

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
    setComponentsDataFiltered(filteredComponents);
    break;
    case "product":
    const filteredProducts = productsData.filter(
        (product) =>
        product.productReference
            .toLowerCase()
            .includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase())
    );
    setEquivalencesDataFiltered(filteredProducts);
    break;
    default:
    console.log("error");
}
};

const dropProduct = (confirm) =>{
if(confirm){
    api.put(`/products/delete/${productSelected._id}`)
    .then((response)=>{
        getProducts()
        btnClose()
    })
}
setShowConfirm(false);
}

return (
<div className="component">
    <div className="optionBtn">
    <img
        src={agregar}
        className="link"
        alt="agregar"
        title="Nou producte"
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
    {productsData &&
        productsData.length > 0 &&
        productsData.map((component, index) => (
        <div
            key={index}
            className="components-container_component link"
            onClick={() => {
            selectComponent(component);
            setComponentDetailVisible(true);
            }}
        >
            <p>{component.productReference}</p>
            <p>{component.sanitaryProductReference}</p>
            <p>{component.description}</p>
        </div>
        ))}

    {componentDetailVisible && (
        <div className="">
        {isEdit || isNew ? (
            <div className="component-detail-container">
            {isNew ? <h1>NOU PRODUCTE</h1> : <h1>MODIFICAR PRODUCTE</h1>}
            <div className="buttons-box">
            <div className="optionBtn">
            <img
                src={aceptar}
                alt="aceptar"
                className="link"
                title="Guardar"
                onClick={() => {
                newProduct();
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
                defaultValue={!isNew ? productSelected.productReference : ""}
                placeholder="Referència"
                onChange={(e) => {
                setProductReference(e.target.value);
                }}
                className="text_input"
            />
            <input
                defaultValue={
                !isNew ? productSelected.sanitaryProductReference : ""
                }
                placeholder="Referència sanitària"
                onChange={(e) => {
                setSanitaryProductReference(e.target.value);
                }}
                className="text_input"
            />
            <input
                defaultValue={!isNew ? productSelected.description : ""}
                placeholder="nom"
                onChange={(e) => {
                setDescription(e.target.value);
                }}
                className="text_input"
            />
            <input
                defaultValue={!isNew ? `${productSelected.price}` : ""}
                placeholder="preu"
                onChange={(e) => {
                setPrice(e.target.value);
                }}
                className="text_input"
            />
            <input
            defaultValue={!isNew ? `${productSelected.priceSale}` : ""}
            placeholder="preu venta"
            onChange={(e) => {
            setPriceSale(e.target.value);
            }}
            className="text_input"
        />
        
        </div>
           
            <div className="headboard">
                <p>Proveidors</p>
                <p>Processos</p>
                <p>Components</p>
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
                <input
                placeholder="buscar ref. o nom"
                onChange={(e) => fnFilter("product", e.target.value)}
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
                    {componentsDataFiltered &&
                    componentsDataFiltered.length > 0 &&
                    componentsDataFiltered.map((component, index) => (
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
                <div className="list-container">
                    {equivalencesDataFiltered &&
                    equivalencesDataFiltered.length > 0 &&
                    equivalencesDataFiltered.map((product, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            onChange={(e) => {
                            componentRelations(
                                e.target.checked,
                                product._id,
                                product.productReference,
                                "product"
                            );
                            }}
                        />
                        <p>{product.productReference}</p>
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
                    {componentsDataFiltered &&
                    componentsDataFiltered.length > 0 &&
                    componentsDataFiltered.map((component, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            checked={componentsList.some(
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
                <div className="list-container">
                    {equivalencesDataFiltered &&
                    equivalencesDataFiltered.length > 0 &&
                    equivalencesDataFiltered.map((product, index) => (
                        <div className="list-check" key={index}>
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            checked={equivalencesList.some(
                            (item) => item.id === product._id
                            )}
                            onChange={(e) => {
                            componentRelations(
                                e.target.checked,
                                product._id,
                                product.productReference,
                                "product"
                            );
                            }}
                        />
                        <p>{product.productReference}</p>
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
                {componentsList &&
                    componentsList.length > 0 &&
                    componentsList.map((component, index) => (
                    <div className="list-check" key={index}>
                        <p>{component.name}</p>
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
            <div className="optionBtn link">
            <img
            src={papelera}
            alt="eliminar"
            title="Eliminar"
            onClick={() => {
                setShowConfirm(true)
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
            <h1>{productSelected.description}</h1>
            <h1>
            {productSelected.productReference}{" "}
            {productSelected.sanitaryProductReference &&
            `(${productSelected.sanitaryProductReference})`}
        </h1>
            <p>Preu compra: {productSelected.price} €</p>
            <p>Preu venta: {productSelected.priceSale}€</p>
            <h2>Components</h2>
            {productSelected.components &&
                productSelected.components.length > 0 &&
                productSelected.components.map((item, index) => (
                <div key={index}>
                    <p>{item.componentReference}</p>
                </div>
                ))}
            <h2>Proveidors</h2>
            {productSelected.providers &&
                productSelected.providers.length > 0 &&
                productSelected.providers.map((item, index) => (
                <div key={index}>
                    <p>{item.name}</p>
                </div>
                ))}
            <h2>Processos</h2>
            {productSelected.processes &&
                productSelected.processes.length > 0 &&
                productSelected.processes.map((item, index) => (
                <div key={index}>
                    <p>{item.name}</p>
                </div>
                ))}

            <h2>Equivalències</h2>
            {productSelected.equivalences &&
                productSelected.equivalences.length > 0 &&
                productSelected.equivalences.map((item, index) => (
                <div key={index}>
                    <p>{item.productReference}</p>
                </div>
                ))}
            </div>
        )}
        </div>
    )}
    {showConfirm && (
        <DeleteConfirm
        text = {productSelected.productReference} 
        onAceptar = {() => dropProduct(true)}
        onCancelar = {() => dropProduct(false)}
    />)}
    </div>
</div>
);
};

export default Products;
