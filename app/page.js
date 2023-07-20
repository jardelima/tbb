"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.css";

// Icons
import { AiOutlineSearch as IconSearch } from "react-icons/ai";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";

// API
import { API } from "./api/route";

export default function Home() {
    const [activeFilter, setActiveFilter] = useState(false);
    const [productsFilter, setProductsFilter] = useState([]);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    let APIProducts = API.data.nodes;

    useEffect(() => {
        const groupByType = APIProducts.reduce((count, product) => {
            count[product.category.name] = count[product.category.name] + 1 || 1;

            return count;
        }, {});

        for(let i = 0; i < Object.keys(groupByType).length; i++) {
            setProductsFilter((productsFilter) => [
                ...productsFilter,
                {
                    "name": Object.keys(groupByType)[i],
                    "quantity": Object.values(groupByType)[i]
                }
            ]);
        }
    }, []);

    useEffect(() => {
        APIProducts.map(product => {
            setProducts((products) => [
                ...products,
                product
            ]);
        });
    }, []);

    function filteredType(type) {
        if(type.checked) {
            setFilterType(type.id);
        }

        if(type.checked && type.id === "All") {
            setFilterType("All");
        }
    }

    useEffect(() => {
        if(filterType === "All") {
            document.querySelector("#All").setAttribute("checked", "checked")
        }
    }, [filterType]);

    const filterItemSearch = search !== "" ? products.filter(product => product.name.toLowerCase().includes(search.toLowerCase())) : products.filter(product => product.category.name.includes(filterType === "All" ? "" : filterType));

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>O que você <span className={styles.titleColor}>está procurando?</span></h1>

            <div className={styles.search}>
                <input 
                    className={styles.searchInput} 
                    type="text" 
                    name="search" 
                    id="search" 
                    placeholder="Busque aqui" 
                    value={search} 
                    onChange={({target}) => setSearch(target.value)} 
                />
                <IconSearch className={styles.searchIcon} />
            </div>

            <section className={styles.content}>
                <div className={`${styles.filter} ${activeFilter && styles.filterActive}`}>
                    <p onClick={() => setActiveFilter(!activeFilter)}>Filtros <ArrowDown className={`${activeFilter && styles.arrowActive}`} /></p>

                    <div className={styles.filterItems}>
                        <div className={styles.filterItem}>
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    id="All"
                                    onChange={({target}) => filteredType(target)}
                                />
                                <label htmlFor="All">Todos ({products.length})</label>
                            </div>
                        {productsFilter.map((product, index) => (
                            <div className={styles.filterItem} key={index}>
                                <input 
                                    type="radio" 
                                    name="filter" 
                                    id={product.name} 
                                    onChange={({target}) => filteredType(target)}
                                />
                                <label htmlFor={product.name}>{product.name} ({product.quantity})</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.items}>
                    <div className={styles.itemsHeader}>
                        <p>{filterItemSearch.length} resultados</p>
                    </div>

                    <div className={styles.itemsProducts}>
                        {  
                            filterItemSearch.map((product, index) => (
                                <div className={styles.itemsProduct} key={index}>
                                    <img src={product.images[0].asset.url} alt={product.images[0].alt}/>
                                    <p>{product.name}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </main>
    )
}
