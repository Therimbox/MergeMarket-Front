import React, { useState } from 'react';
import api from '../api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import '../css/Scraping.css';

const Scraping = () => {
    const [loading, setLoading] = useState(false);
    const toast = React.useRef(null);

    const scrapingData = {
        procesadores: [
            { url: "https://www.pccomponentes.com/procesadores", category: 1, name: "PC Componentes" },
            { url: "https://www.coolmod.com/componentes-pc-procesadores/", category: 1, name: "CoolMod" },
            { url: "https://www.amazon.es/gp/bestsellers/computers/937925031/ref=zg_bs_pg_2_computers", category: 1, name: "Amazon" }
        ],
        graficas: [
            { url: "https://www.pccomponentes.com/tarjetas-graficas", category: 2, name: "PC Componentes" },
            { url: "https://www.coolmod.com/tarjetas-graficas/", category: 2, name: "CoolMod" }
        ],
        placasBase: [
            { url: "https://www.pccomponentes.com/placas-base", category: 3, name: "PC Componentes" },
            { url: "https://www.coolmod.com/componentes-pc-placas-base/", category: 3, name: "CoolMod" }
        ],
        ram: [
            { url: "https://www.pccomponentes.com/memorias-ram", category: 4, name: "PC Componentes" }
        ]
    };

    const handleScrape = async (url, category) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticación no encontrado');
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: { baseUrl: url }
            };

            const categoryResponse = await api.get(`/api/productcategories/${category}`, config);
            const categoryData = categoryResponse.data;

            const response = await api.post(`/api/webscraping/scrape`, categoryData, config);

            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Scraping realizado correctamente', life: 5000 });
        } catch (error) {
            console.error('Error during scraping:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error durante el scraping', life: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const handleScrapeCategory = async (categoryData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticación no encontrado');
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            for (let site of categoryData) {
                const { url, category } = site;
                const categoryResponse = await api.get(`/api/productcategories/${category}`, config);
                const categoryData = categoryResponse.data;

                await api.post(`/api/webscraping/scrape`, categoryData, {
                    ...config,
                    params: { baseUrl: url }
                });
            }

            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Scraping de la categoría realizado correctamente', life: 5000 });
        } catch (error) {
            console.error('Error during scraping:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error durante el scraping de la categoría', life: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const handleScrapeAllCategories = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticación no encontrado');
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            for (let categoryKey in scrapingData) {
                const categoryData = scrapingData[categoryKey];
                for (let site of categoryData) {
                    const { url, category } = site;
                    const categoryResponse = await api.get(`/api/productcategories/${category}`, config);
                    const categoryData = categoryResponse.data;

                    await api.post(`/api/webscraping/scrape`, categoryData, {
                        ...config,
                        params: { baseUrl: url }
                    });
                }
            }

            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Scraping de todas las categorías realizado correctamente', life: 5000 });
        } catch (error) {
            console.error('Error during scraping:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error durante el scraping de todas las categorías', life: 5000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scraping-container">
            <h2>Scraping Tools</h2>
            <Toast ref={toast} />
            {loading && <ProgressSpinner className="loading-spinner" />}
            <Accordion>
                <AccordionTab header="Procesadores">
                    <Button
                        label="Todos"
                        onClick={() => handleScrapeCategory(scrapingData.procesadores)}
                        className="p-button-outlined p-button-success"
                        disabled={loading}
                    />
                    {scrapingData.procesadores.map((site, index) => (
                        <Button
                            key={index}
                            label={`${site.name}`}
                            onClick={() => handleScrape(site.url, site.category)}
                            className="p-button-outlined p-button-info"
                            disabled={loading}
                        />
                    ))}
                </AccordionTab>
                <AccordionTab header="Tarjetas Gráficas">
                    <Button
                        label="Todos"
                        onClick={() => handleScrapeCategory(scrapingData.graficas)}
                        className="p-button-outlined p-button-success"
                        disabled={loading}
                    />
                    {scrapingData.graficas.map((site, index) => (
                        <Button
                            key={index}
                            label={`${site.name}`}
                            onClick={() => handleScrape(site.url, site.category)}
                            className="p-button-outlined p-button-info"
                            disabled={loading}
                        />
                    ))}
                </AccordionTab>
                <AccordionTab header="Placas Base">
                    <Button
                        label="Todos"
                        onClick={() => handleScrapeCategory(scrapingData.placasBase)}
                        className="p-button-outlined p-button-success"
                        disabled={loading}
                    />
                    {scrapingData.placasBase.map((site, index) => (
                        <Button
                            key={index}
                            label={`${site.name}`}
                            onClick={() => handleScrape(site.url, site.category)}
                            className="p-button-outlined p-button-info"
                            disabled={loading}
                        />
                    ))}
                </AccordionTab>
                <AccordionTab header="RAM">
                    <Button
                        label="Todos"
                        onClick={() => handleScrapeCategory(scrapingData.ram)}
                        className="p-button-outlined p-button-success"
                        disabled={loading}
                    />
                    {scrapingData.ram.map((site, index) => (
                        <Button
                            key={index}
                            label={`${site.name}`}
                            onClick={() => handleScrape(site.url, site.category)}
                            className="p-button-outlined p-button-info"
                            disabled={loading}
                        />
                    ))}
                </AccordionTab>
            </Accordion>
            <Button
                label="Scraping Todas las Categorías"
                onClick={handleScrapeAllCategories}
                className="p-button-outlined p-button-danger"
                disabled={loading}
            />
        </div>
    );
};

export default Scraping;
