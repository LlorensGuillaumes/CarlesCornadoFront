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
import ChangeCurrency from "../ChangeCurrency/ChangeCurrency";

const Products = () => {
const [productsData, setProductsData] = useState([]);
const [componentsData, setComponentsData] = useState([]);
const [providersData, setprovidersData] = useState([]);
const [processesData, setProcessesData] = useState([]);
const [componentDetailVisible, setComponentDetailVisible] = useState(false);
const [providerPrice, setProviderPrice] = useState({
idProvider: null,
price: null,
currency: null,
});
const [finalPrice, setFinalPrice] = useState();
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

const [showChageCurrency, setShowChangeCurrency] = useState(false);
const [priceCalculate, setPriceCalculate] = useState([
{ name: "", price: "", currency: "" },
]);
const [priceToChageCurrency, setPriceToChangeCurrency] = useState({
name: "",
value: "",
currency: "",
});

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
    console.log(response)
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

const componentRelations = (event, relations, relationName, item) => {
    console.log(relations, item)
const isChecked = event;
const relation = {
    id: relations._id,
    name: relationName,
    price:
    item === "provider"
    ? providerPrice.idProvider === relations._id
        ? providerPrice.price
        : null
    : item === "component"
        ? relations.priceSale
        : relations.price,

    currency: item === "provider" 
        ? providerPrice.currency
        : relations.currency,
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
        ? setComponentsList((prevList) => [...prevList, relation])
        : setComponentsList((prevList) =>
            prevList.filter((item) => item.id !== relations._id)
        );
    break;
    case "product":
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

const selectComponent = (product) => {
    console.log(product);
    setProductSelected(product);

    const equivalences = product.equivalences;
    const processes = product.processes;
    const providers = product.providers;
    const components = product.components;

    setProviderList([]);
    setProcessesList([]);
    setEquivalencesList([]);
    setComponentsList([]);

    console.log('equivalences', equivalences);
    console.log('processes', processes);
    console.log('providers', providers);
    console.log('components', components);

    const equivalencesList = equivalences.map((equivalence) => ({
        id: equivalence._id,
        name: equivalence.productReference,
        price: null,
        currency: null,
    }));

    setEquivalencesList(equivalencesList);

    const processesList = processes.map((process) => ({
        id: process._id,
        name: process.name,
        price: process.price,
        currency: process.currency,
    }));

    setProcessesList(processesList);

    const providersList = providers.map((provider) => ({
        id: provider.providers._id,
        name: provider.providers.name,
        price: provider.priceSale,
        currency: provider.providers.currency,
    }));

    setProviderList(providersList);

    const componentsList = components.map((component) => ({
        id: component._id,
        name: component.componentReference,
        price: component.priceSale,
        currency: '€',
    }));

    setComponentsList(componentsList);
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
    providers: providersList.map((item) => ({
        providers: item.id,
        price: item.price,
    })),
    equivalences: TreatyArray.dropDuplicatesAndEmpty(
    equivalencesList.map((item) => item.id)
    ),
    priceSale: priceSale,
};
console.log(newProduct)
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

const dropProduct = (confirm) => {
if (confirm) {
    api.put(`/products/delete/${productSelected._id}`).then((response) => {
    getProducts();
    btnClose();
    });
}
setShowConfirm(false);
};

const fnCalculatePriceCurrency = (isChecked, name, price, currency) => {
if (!isChecked) {
    const newPriceCalculate = priceCalculate.filter(
    (item) => item.name !== name
    );
    setPriceCalculate(
    newPriceCalculate.filter(
        (item) =>
        item.name !== "" && item.price !== "" && item.currency !== ""
    )
    );
} else {
    if (currency !== "€") {
    setPriceToChangeCurrency({
        name: name,
        value: price,
        currency: currency,
    });
    setShowChangeCurrency(true);
    } else {
    fnCalculatePrice(name, price);
    }
}
};

const fnCalculatePrice = (name, price) => {
const newItemPrice = {
    name: name,
    price: price,
    currency: "€",
};
setPriceCalculate([...priceCalculate, newItemPrice]);
};
console.log(providersList)
console.log(processesList)
console.log(equivalencesList)
console.log(componentsList)
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
        productsData.map((product, index) => (
        <div
            key={index}
            className="components-container_component link"
            onClick={() => {
            selectComponent(product);
            setComponentDetailVisible(true);
            }}
        >
            <p>{product.productReference}</p>
            <p>{product.sanitaryProductReference}</p>
            <p>{product.description}</p>
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
                    setIsEdit(false);
                    setIsNew(false)
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
                    !isNew ? productSelected.productReference : ""
                }
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

            {
                (isNew || isEdit) && (
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
                            checked={processesList.some(
                                (item) => item.id === process._id
                            )}
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
                            <p id="componentProviderPrice">
                            {process.price}
                            {process.currency}
                            </p>
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
                                component,
                                component.componentReference,
                                "component"
                                );
                            }}
                            />
                            <p className="component_process-item">
                            {component.componentReference}
                            </p>
                            <p id="componentProviderPrice">
                            {component.priceSale} €
                            </p>
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
                                product,
                                product.productReference,
                                "product"
                                );
                            }}
                            />
                            <p className="component_equivalence-item">
                            {product.productReference}
                            </p>
                        </div>
                        ))}
                    </div>
                </div>
                ) // : (
                //     <div className="optionsSelector">
                //     <div className="list-container">
                //         {providersDataFiltered &&
                //         providersDataFiltered.length > 0 &&
                //         providersDataFiltered.map((provider, index) => (
                //             <div className="list-check" key={index}>
                //             <input
                //                 type="checkbox"
                //                 className="checkbox-style"
                //                 checked={providersList.some(
                //                 (item) => item.id === provider._id
                //                 )}
                //                 onChange={(e) => {
                //                 componentRelations(
                //                     e.target.checked,
                //                     provider._id,
                //                     provider.name,
                //                     "provider"
                //                 );
                //                 }}
                //             />
                //             <p>{provider.name}</p>
                //             </div>
                //         ))}
                //     </div>
                //     <div className="list-container">
                //         {processesDataFiltered &&
                //         processesDataFiltered.length > 0 &&
                //         processesDataFiltered.map((process, index) => (
                //             <div className="list-check" key={index}>
                //             <input
                //                 type="checkbox"
                //                 className="checkbox-style"
                //                 checked={processesList.some(
                //                 (item) => item.id === process._id
                //                 )}
                //                 onChange={(e) => {
                //                 componentRelations(
                //                     e.target.checked,
                //                     process._id,
                //                     process.name,
                //                     "process"
                //                 );
                //                 }}
                //             />
                //             <p>{process.name}</p>
                //             </div>
                //         ))}
                //     </div>
                //     <div className="list-container">
                //         {componentsDataFiltered &&
                //         componentsDataFiltered.length > 0 &&
                //         componentsDataFiltered.map((component, index) => (
                //             <div className="list-check" key={index}>
                //             <input
                //                 type="checkbox"
                //                 className="checkbox-style"
                //                 checked={componentsList.some(
                //                 (item) => item.id === component._id
                //                 )}
                //                 onChange={(e) => {
                //                 componentRelations(
                //                     e.target.checked,
                //                     component._id,
                //                     component.componentReference,
                //                     "component"
                //                 );
                //                 }}
                //             />
                //             <p>{component.componentReference}</p>
                //             </div>
                //         ))}
                //     </div>
                //     <div className="list-container">
                //         {equivalencesDataFiltered &&
                //         equivalencesDataFiltered.length > 0 &&
                //         equivalencesDataFiltered.map((product, index) => (
                //             <div className="list-check" key={index}>
                //             <input
                //                 type="checkbox"
                //                 className="checkbox-style"
                //                 checked={equivalencesList.some(
                //                 (item) => item.id === product._id
                //                 )}
                //                 onChange={(e) => {
                //                 componentRelations(
                //                     e.target.checked,
                //                     product._id,
                //                     product.productReference,
                //                     "product"
                //                 );
                //                 }}
                //             />
                //             <p>{product.productReference}</p>
                //             </div>
                //         ))}
                //     </div>
                //     </div>
                // )
            }

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
                        <p className="component_provider-item">{process.name}</p>
                        <p id="componentProviderPrice">{process.price}</p>
                        <p>{process.currency}</p>
                    </div>
                    ))}
                </div>
                <div className="list-container">
                {componentsList &&
                    componentsList.length > 0 &&
                    componentsList.map((component, index) => (
                    <div className="list-check" key={index}>
                        <p className="component_provider-item">{component.name}</p>
                        <p id="componentProviderPrice">{component.price}</p>
                        <p>{component.currency} €</p>
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
                <h1>{productSelected.description}</h1>
                <h1>
                    {productSelected.productReference}{" "}
                    {productSelected.sanitaryProductReference &&
                    `(${productSelected.sanitaryProductReference})`}
                </h1>
                <p>Preu venta: {productSelected.priceSale}€</p>
                <h2>Components</h2>
                {productSelected.components &&
                    productSelected.components.length > 0 &&
                    productSelected.components.map((item, index) => (
                    <div key={index} className="components_provider_list">
                    <input
                    type="checkbox"
                    onChange={(e) => {
                        fnCalculatePriceCurrency(
                        e.target.checked,
                        item.componentReference,
                        item.priceSale,
                        "€"
                        );
                    }}
                    />
                        <p>{item.componentReference} {item.priceSale} €</p>
                    </div>
                    ))}
                <h2>Proveidors</h2>
                {productSelected && productSelected.providers &&
                    productSelected.providers.length > 0 &&
                    productSelected.providers.map((item, index) => (
                    <div key={index} className="components_provider_list">
                        <input
                        type="checkbox"
                        onChange={(e) => {
                            fnCalculatePriceCurrency(
                            e.target.checked,
                            item.providers.name,
                            item.price,
                            item.providers.currency
                            );
                        }}
                        />
                        <p>
                        {item.providers.name} {item.price}{" "}
                        {item.providers.currency}
                        </p>
                    </div>
                    ))}
                <h2>Processos</h2>
                {productSelected.processes &&
                    productSelected.processes.length > 0 &&
                    productSelected.processes.map((item, index) => (
                    <div key={index} className="processes_price_input">
                        <input
                        type="checkbox"
                        onChange={(e) => {
                            fnCalculatePriceCurrency(
                            e.target.checked,
                            item.name,
                            item.price,
                            item.currency
                            );
                        }}
                        />
                        <p>
                        {item.name} {item.price} {item.currency}
                        </p>
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
                <div className="calculate_price">
                <h3>Preu de cost: {finalPrice} €</h3>
                {priceCalculate &&
                    priceCalculate.length > 0 &&
                    priceCalculate.map((item, index) => (
                    <div key={index}>
                        <p>
                        {item.name} {item.price} {item.currency}
                        </p>
                    </div>
                    ))}
                </div>
            </div>
            </div>
        )}
        </div>
    )}
    {showConfirm && (
        <DeleteConfirm
        text={productSelected.productReference}
        onAceptar={() => dropProduct(true)}
        onCancelar={() => dropProduct(false)}
        />
    )}
    {showChageCurrency && (
        <ChangeCurrency
        objectToChange={priceToChageCurrency}
        onAceptar={(data) => {
            fnCalculatePrice(data.name, data.value);
            setShowChangeCurrency(false);
        }}
        onCancelar={() => setShowChangeCurrency(false)}
        />
    )}
    </div>
</div>
);
};

export default Products;
