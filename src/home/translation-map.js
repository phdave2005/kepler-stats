export const TEXT_MAP = {
    en: {
        chart: {
            title: 'Kepler Objects of Interest (KOI)',
            xLabels: [
                'KOI Search Hits',
                'Earth-Like KOI'
            ]
        },
        heading: {
            main: 'Parameters',
            filters: 'Filters'
        },
        menu: {
            heading: 'Refine your search',
            button: {
                main: 'Parameters',
                filters: 'Filters',
                reset: 'Reset',
                search: 'Search'
            }
        },
        processing: {
            text: 'Processing...'
        },
        validation: {
            error: {
                api: 'An error was encountered while retrieving the data!',
                noData: 'These search parameters did not return any data!',
                oneParameter: 'At least one search parameter must be used!'
            },
            labels: {
                anyNumber: 'Must be a number',
                positiveNumber: 'Need number > 0',
                positiveNumberList: 'Need all numbers > 0'
            },
            success: {
                downloaded: 'Your search data was downloaded!'
            }
        }
    },
    es: {
        chart: {
            title: 'Objetos de interés de Kepler (KOI)',
            xLabels: [
                'Resultados de búsqueda de KOI',
                'KOI parecido a la Tierra'
            ]
        },
        heading: {
            main: 'Parámetros',
            filters: 'Filtros'
        },
        menu: {
            heading: 'Refina tu búsqueda',
            button: {
                main: 'Parámetros',
                filters: 'Filtros',
                reset: 'Reiniciar',
                search: 'Buscar'
            }
        },
        processing: {
            text: 'Procesando...'
        },
        validation: {
            error: {
                api: '¡Se encontró un error al recuperar los datos!',
                noData: '¡Estos parámetros de búsqueda no arrojaron ningún dato!',
                oneParameter: '¡Se debe utilizar al menos un parámetro de búsqueda!'
            },
            labels: {
                anyNumber: 'Tiene que ser un número',
                positiveNumber: 'Necesita número > 0',
                positiveNumberList: 'Necesita todos los números > 0'
            },
            success: {
                downloaded: '¡Tus datos de búsqueda fueron descargados!'
            }
        }
    },
    fr: {
        chart: {
            title: 'Objets d\'intérêt Kepler (KOI)',
            xLabels: [
                'Résultats de recherche KOI',
                'KOI semblable à la Terre'
            ]
        },
        heading: {
            main: 'Paramètres',
            filters: 'Filtres'
        },
        menu: {
            heading: 'Précisez votre recherche',
            button: {
                main: 'Paramètres',
                filters: 'Filtres',
                reset: 'Réinitialiser',
                search: 'Recherche'
            }
        },
        processing: {
            text: 'Traitement...'
        },
        validation: {
            error: {
                api: 'Une erreur s\'est produite lors de la récupération des données!',
                noData: 'Ces paramètres de recherche n\'ont renvoyé aucune donnée!',
                oneParameter: 'Au moins un paramètre de recherche doit être utilisé!'
            },
            labels: {
                anyNumber: 'Doit être un nombre',
                positiveNumber: 'Besoin d\'un numéro > 0',
                positiveNumberList: 'Besoin de tous les nombres > 0'
            },
            success: {
                downloaded: 'Vos données de recherche ont été téléchargées!'
            }
        }
    },
    it: {
        chart: {
            title: 'Oggetti di interesse di Keplero (KOI)',
            xLabels: [
                'Risultati ricerca KOI',
                'KOI simili alla Terra'
            ]
        },
        heading: {
            main: 'Parametri',
            filters: 'Filtri'
        },
        menu: {
            heading: 'Perfeziona la tua ricerca',
            button: {
                main: 'Parametri',
                filters: 'Filtri',
                reset: 'Ripristina',
                search: 'Ricerca'
            }
        },
        processing: {
            text: 'In Lavorazione...'
        },
        validation: {
            error: {
                api: 'Si è verificato un errore durante il recupero dei dati!',
                noData: 'Questi parametri di ricerca non hanno restituito alcun dato!',
                oneParameter: 'È necessario utilizzare almeno un parametro di ricerca!'
            },
            labels: {
                anyNumber: 'Deve essere un numero',
                positiveNumber: 'È necessario un numero > 0',
                positiveNumberList: 'Sono necessari tutti i numeri > 0'
            },
            success: {
                downloaded: 'I tuoi dati di ricerca sono stati scaricati!'
            }
        }
    }
};

export default TEXT_MAP;
