import React, { Component } from 'react'
import CanvasJS from '@canvasjs/charts';
import axios from 'axios'
import { faArrowsRotate, faGlobe, faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './home.css'
import MainForm from '../forms/main/main-form.js'
import FiltersForm from '../forms/filters/filters-form.js'
import processing from './processing.svg'
import TEXT_MAP from './translation-map.js'

class Home extends Component {
    constructor(props) {
        super(props);
        this.keplerPath = 'https://asterank.com/api/kepler';
        this.corsDomain = 'https://corsproxy.io';
        this.language = window?.localStorage?.getItem("language-used") || 'en';
        this.textUsed = TEXT_MAP[this.language];
        this.state = {
            forms: {
                cl: '',
                active: 'main',
                sections: {
                    main: {
                        show: true,
                        heading: this.textUsed.heading.main
                    },
                    filters: {
                        show: false,
                        heading: this.textUsed.heading.filters
                    }
                },
                validation: {
                    error: {
                        cl: 'DN invalid',
                        text: ''
                    },
                    processing: {
                        cl: 'DN',
                        text: null
                    }
                }
            },
            stats: {
                cl: 'DN'
            }
        };
    }

    search = () => {
        if (!this.isProcessing() && !this.invalidateFormActiveSection()) {
            document.getElementById("parameters-form").getElementsByTagName("BUTTON")[0].click();
        }
    }

    isProcessing = () => {
        const el = document.getElementById("processing-container");
        return !!el && !el.classList.contains("DN");
    };

    processFormSubmission = (e) => {
        e.preventDefault();
        const elements = e.target.querySelectorAll("[data-search-category]");
        let i,
            val,
            ID,
            type,
            category,
            filterData,
            searchData = {
                payload: {},
                filters: {}
            };
        for(i in elements) {
            if (i.match(/^\d+$/) && !!elements[i] && elements[i].nodeName && !!elements[i]?.getAttribute("data-search-category")) {
                val = elements[i]?.value.trim();
                if (val) {
                    if (!!elements[i]?.type) {
                        ID = elements[i].id;
                        category = elements[i].getAttribute("data-search-category");
                        filterData = elements[i].getAttribute("data-filter") || null;
                        type = elements[i].type;
                        if (val) {
                            searchData[category][ID] = {
                                filter: filterData,
                                nodeName: elements[i].nodeName,
                                type: type,
                                value: val
                            };
                        }
                    }
                }
            }
        }
        if (Object.keys(searchData.payload).length) {
            this.setState(state => (state.forms.validation = {
                error: {
                    cl: 'DN invalid',
                    text: ''
                },
                processing: {
                    cl: '',
                    text: null
                }
            }, state));
            this.fetchData(searchData);
        } else{
            this.setState(state => (state.forms.validation = {
                error: {
                    cl: 'invalid',
                    text: this.textUsed.validation.error.oneParameter
                },
                processing: {
                    cl: 'DN',
                    text: null
                }
            }, state));
        }
    }

    constructQueryString(data) {
        let i, boundaryConditions, operator, value, field, keyName, mongoMap = {};
        for(i in data) {
            if (!!data[i]?.value) {
                value = data[i].value;
                field = document.getElementById(i);
                keyName = '';
                while(field.nodeName.toLowerCase() !== 'fieldset') {
                    field = field.parentNode;
                }
                keyName = field.getAttribute("data-mongo-keyname");
                if (!!keyName) {
                    operator = document.querySelectorAll("[data-target-id=" + i + "]")[0].value || '';
                    if (!!operator) {
                        boundaryConditions = mongoMap.hasOwnProperty(keyName) ? mongoMap[keyName] : {};
                        boundaryConditions['$' + operator] = operator.match(/^n?in$/) ? value.split(",").filter(el => el.trim()) : Number(value);
                        mongoMap[keyName] = boundaryConditions;
                    }
                }
            }
        }
        return JSON.stringify(mongoMap);
    };

    isLocalhost() {
        return document.URL.indexOf("localhost") !== -1;
    }

    getQueryLimit() {
        const maximumSearchResults = Number(document.getElementById("max-search-results").value);
        return (!isNaN(maximumSearchResults) && maximumSearchResults.toString().match(/^\d+$/) && (maximumSearchResults > 0)) ? maximumSearchResults : 1000000;
    }

    fetchData(searchData) {
        const payload = searchData.payload;
        if (!window.navigator.onLine && this.isLocalhost()) {
            import(`../constants/mock-response.js`)
            .then((response) => {
                const mockResponseData = response.MOCK_RESPONSE;
                this.processResponse(mockResponseData);
            });
        } else {
            const results = this.keplerPath + '?query=' + this.constructQueryString(payload) + '&limit=' + this.getQueryLimit();
            axios.get(this.corsDomain + '/?' + encodeURIComponent(results))
            .then((response) => {
                if (response?.data?.length) {
                    this.processResponse(response.data);
                } else {
                    this.setState(state => (state.forms.validation = {
                        error: {
                            cl: 'invalid',
                            text: this.textUsed.validation.error.noData
                        },
                        processing: {
                            cl: 'DN',
                            text: null
                        }
                    }, state));
                }
            })
            .catch((error) => {
                this.setState(state => (state.forms.validation = {
                    error: {
                        cl: 'invalid',
                        text: this.textUsed.validation.error.api
                    },
                    processing: {
                        cl: 'DN',
                        text: null
                    }
                }, state));
            });
        }
    }

    processResponse(data) {
        this.downloadData(data);
    }

    downloadData(data) {
        const date = new Date();
        const str = JSON.stringify(data, undefined, 2);
        const blob = new Blob([str], {
            type: "application/json"
        });
        const downloadLink = document.getElementById("download");
        downloadLink.setAttribute("href", URL.createObjectURL(blob));
        downloadLink.setAttribute("download", "data_" + date.toISOString().split("T")[0] + "-" + date.getTime() + ".json");
        downloadLink.click();
        this.setState({
            stats: {
                cl: 'MT64'
            }
        });
        setTimeout(() => {
            this.setState(state => (state.forms.validation = {
                error: {
                    cl: 'valid',
                    text: this.textUsed.validation.success.downloaded
                },
                processing: {
                    cl: 'DN',
                    text: null
                }
            }, state));
            this.renderStats(data);
            setTimeout(() => {
                this.setState(state => (state.forms.validation = {
                    error: {
                        cl: 'DN',
                        text: ''
                    },
                    processing: {
                        cl: 'DN',
                        text: null
                    }
                }, state));
            }, 6000);
        }, 500);
    }

    renderStats(data) {
        let chart = new CanvasJS.Chart("chart-container", {
            title:{
                text: this.textUsed.chart.title
            },
            data: [{
                type: "column",
                dataPoints: [
                    { label: this.textUsed.chart.xLabels[0],  y: data.length  },
                    { label: this.textUsed.chart.xLabels[1], y: this.getEarthLikeMatches(data)  }
                ]
            }]
        });
        this.setState({
            stats: {
                cl: 'MT32'
            }
        });
        chart.render();
    }

    getEarthLikeMatches(data) {
        return data.filter(d => (d.T0 >= 223 && d.T0 <= 308)).length;
    }

    invalidateFormActiveSection = () => {
        const validate = (f) => {
            const errorLabels = [];
            if (!!f?.value) {
                const validations = f.getAttribute("data-validations");
                let invalid, j, num, splitList;
                validations.split(",").forEach((validation) => {
                    switch(validation) {
                        case 'anyNumber':
                            num = Number(f.value);
                            invalid = isNaN(num);
                        break;
                        case 'anyNumberList':
                            splitList = f.value.split(",");
                            for(j in splitList) {
                                num = Number(splitList[j]);
                                if (isNaN(num)) {
                                    invalid = true;
                                    break;
                                }
                            }
                        break;
                        case 'positiveNumberList':
                            splitList = f.value.split(",");
                            for(j in splitList) {
                                num = Number(splitList[j]);
                                if (isNaN(num) || num <= 0) {
                                    invalid = true;
                                    break;
                                }
                            }
                        break;
                        default: // 'positiveNumber':
                            num = Number(f.value);
                            invalid = isNaN(num) || (num <= 0);
                        break;
                    }
                    if (invalid) {
                        errorLabels.push(this.textUsed.validation.labels[validation]);
                    }
                });
            }
            return errorLabels;
        };

        let field,
            errorLabels,
            i,
            id,
            validationSection,
            hasError = false;
        const activeSection = document.getElementById("parameters-form").getElementsByClassName("active");
        if (activeSection?.length === 1) {
            validationSection = activeSection[0].querySelectorAll("[data-validations]");
            for(i in validationSection) {
                id = validationSection[i].id;
                field = document.getElementById(validationSection[i].id);
                if (!!field) {
                    errorLabels = validate(field);
                    if (errorLabels?.length) {
                        hasError = true;
                        this.markInvalidField({
                            elem: document.getElementById(id),
                            errorLabel: errorLabels[0]
                        });
                    } else {
                        this.clearInvalidField({
                            elem: document.getElementById(id),
                            errorLabel: ''
                        });
                    }
                }
            }
        }
        if (!hasError) document.getElementById("main-grid-view").scrollTop = 0;
        return hasError;
    }

    markInvalidField(data) {
        let field = data.elem,
            target,
            label;
        if (!!field) {
            target = field;
            while(!target.classList.contains("flex-field")) {
                target = field.parentElement;
            }
            target.classList.add("invalid");
            label = target.getElementsByTagName("LABEL");
            if (!!label) {
                label[0].getElementsByClassName("default-label")[0].classList.add("DN");
                label[0].getElementsByClassName("error-label")[0].classList.remove("DN");
                label[0].getElementsByClassName("error-label-text")[0].innerHTML = data.errorLabel;
            }
        }
    }

    clearInvalidField(data) {
        let field = data.elem,
            target,
            label;
        if (!!field) {
            target = field;
            while(!target.classList.contains("flex-field")) {
                target = field.parentElement;
            }
            target.classList.remove("invalid");
            label = target.getElementsByTagName("LABEL");
            if (!!label) {
                label[0].getElementsByClassName("default-label")[0].classList.remove("DN");
                label[0].getElementsByClassName("error-label")[0].classList.add("DN");
                label[0].getElementsByClassName("error-label-text")[0].innerHTML = data.errorLabel || '';
            }
        }
    }

    render() {
        const processMenuClick = (e) => {
            if (!this.isProcessing() && !this.invalidateFormActiveSection()) {
                e.preventDefault();
                let newFormState = this.state.forms.sections,
                    i;
                for(i in newFormState) {
                    newFormState[i].show = false;
                }
                newFormState[e.currentTarget.dataset.identifier].show = true;
                this.setState({
                    forms: {
                        active: e.currentTarget.dataset.identifier,
                        validation: {
                            error: {
                                cl: 'DN invalid',
                                text: ''
                            },
                            processing: {
                                cl: 'DN',
                                text: null
                            }
                        },
                        sections: newFormState
                    }
                });
            }
        };
        const resetForm = () => {
            if (!this.isProcessing()) {
                const form = document.getElementById("parameters-form");
                const activeSection = form.getElementsByClassName("active");
                if (activeSection?.length === 1) {
                    const fields = activeSection[0].getElementsByClassName("flex-field");
                    let i;
                    for(i in fields) {
                        if (fields[i]?.nodeName) {
                            fields[i].classList.remove("invalid");
                            fields[i].getElementsByClassName("default-label")[0].classList.remove("DN");
                            fields[i].getElementsByClassName("error-label")[0].classList.add("DN");
                            fields[i].getElementsByClassName("error-label-text")[0].innerHTML = '';
                        }
                    }
                }
                form.reset();
                this.setState({
                    stats: {
                        cl: 'DN'
                    }
                });
            }
        }
        const buttonParameters = [
            { id: 0, text: this.textUsed.menu.button.main, icon: faGlobe, class: 'form', identifier: 'main', fn: processMenuClick },
            { id: 1, text: this.textUsed.menu.button.filters, icon: faFilter, class: 'form', identifier: 'filters', fn: processMenuClick },
            { id: 2, text: this.textUsed.menu.button.reset, icon: faArrowsRotate, class: 'MT40 warning', identifier: 'reset', fn: resetForm },
            { id: 3, text: this.textUsed.menu.button.search, icon: faMagnifyingGlass, class: 'MT40 primary', identifier: 'search', fn: this.search }
        ];
        return (
            <main>
                <div id="main-grid">
                    <div id="main-grid-menu">
                        <h3 className="TAC">{this.textUsed.menu.heading}</h3>
                        <ul>
                        {
                            buttonParameters.map(parameter => {
                                return (
                                    <li key={'navbutton' + parameter.id}>
                                        <button type="button" className={parameter.class} data-identifier={parameter.identifier} data-testid={parameter.identifier + '-button'} onClick={parameter.fn}>
                                            <FontAwesomeIcon icon={parameter.icon} />
                                            <span>{parameter.text}</span>
                                        </button>
                                    </li>
                                );
                            })
                        }
                        </ul>
                    </div>
                    <div id="main-grid-view">
                        <p className={"dialog " + this.state.forms.validation.error.cl} data-identifier="info">{this.state.forms.validation.error.text}</p>
                        <div id="chart-container" className={this.state.stats.cl}></div>
                        <div id="processing-container" className={this.state.forms.validation.processing.cl}>
                            <div>
                                <img className="scale-2" src={processing} alt="processing" data-testid="processing" />
                            </div>
                            <p>{this.textUsed.processing.text}</p>
                        </div>
                        <form id="parameters-form" className={this.state.stats.cl.match(/DN/i) ? '' : 'DN'} data-testid="form" onSubmit={this.processFormSubmission}>
                            <h2 className="form-heading">{this.state.forms.sections[this.state.forms.active].heading}</h2>
                            <MainForm class={this.state.forms.sections.main.show ? 'active' : 'DN'} language={this.language} />
                            <FiltersForm class={this.state.forms.sections.filters.show ? 'active' : 'DN'} language={this.language} />
                            <button type="submit" className="DN"></button>
                        </form>
                        <a href="/" id="download" className="DN">-</a>
                    </div>
                </div>
            </main>
        );
    }
}

export default Home;
