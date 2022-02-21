//MakeBelieveJS
/*
* auth: Kolbeinn Grímsson kolbeinng2ö@ru.is 
* auth: Ómar Pálsson omarp20@ru.is 
* 07.02.2022
*/



class MakeBelieve extends Array {

    parent(query) {
        const retArr = new MakeBelieve();
        for (let i = 0; i < this.length; i++) {
            let parent_node = this[i].parentNode;

            if (query !== undefined) {
                let queryParams = this.queryParser(query);
                console.log(queryParams);
                if (parent_node.tagName == queryParams[1].toUpperCase()) {
                    retArr.push(parent_node);
                } else if (parent_node && parent_node.getAttribute(queryParams[0]) === queryParams[1]) {
                    retArr.push(parent_node);
                }
            } else {
                if (parent_node) {
                    retArr.push(parent_node);
                }
            }
        }

        return retArr;
    };

    grandParent(query) {
        let retArr = new MakeBelieve();
        let nodes = this.parent().parent();
        nodes.forEach(element => {
            retArr.push(element);

        })
        return retArr;
    }

    ancestor(query, nodeList) {
        if (query === undefined) {
            return [];
        }
        let firstElement = document.documentElement;
        let nodes = []

        const nextNodeSearch = [];
        const retArr = new MakeBelieve();

        let queryParams = this.queryParser(query);

        if (!nodeList) {
            nodes = this.grandParent();
        }
        else {
            nodes = nodeList;
        }

        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i++) {

                if (nodes[i].tagName == queryParams[1].toUpperCase()) {
                    retArr.push(nodes[i].parentNode);
                    return retArr;
                } else if (nodes[i] !== firstElement && nodes[i] != null && nodes[i].parentNode && nodes[i].parentNode.getAttribute(queryParams[0]) === queryParams[1]) {
                    retArr.push(nodes[i].parentNode);
                    return retArr;
                }
                if (nodes[i] && nodes[i].parentNode) {
                    nextNodeSearch.push(nodes[i].parentNode)
                }
            }
        }

        if (nextNodeSearch.length > 0) {

            return this.ancestor(query, nextNodeSearch)
        }

        return [];

    }

    onClick(func) {

        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener("click", func);
        }
        return this;
    };

    on(evt, func) {
        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener(evt, func);
        }
        return this;
    };
    // onclick tester
    // __('#password').onClick(function (evt){
    //     console.log(evt.target.value);
    // })

    insertText(text) {
        this.forEach(e => {
            e.textContent = text;
            //e.innerHTML = text;
        })
        return this;
    };

    append(param) {
        for (let i = 0; i < this.length; i++) {
            if (typeof param === 'string' || param instanceof String) {
                this[i].parentNode.insertAdjacentHTML("beforeend", param);
            } else {
                this[i].parentNode.append(param);
            }
        }
        return this;
    }
    // test node
    // __("h1").append(document.createElement('p').appendChild(document.createTextNode('I am an appended paragraph!')))
    // __("h1").append("<p>I was appended!<p>")

    prepend(param) {
        for (let i = 0; i < this.length; i++) {
            if (typeof param === 'string' || param instanceof String) {
                this[i].parentNode.insertAdjacentHTML("afterbegin", param);
            }
            else {
                this[i].parentNode.prepend(param);
            }
        }
        return this;
    }
    // test node
    // __("h1").prepend(document.createElement('p').appendChild(document.createTextNode('I am a prepended paragraph!')))
    // __("h1").prepend("<p>I was prepended!<p>")


    delete() {
        for (let i = 0; i < this.length; i++) {
            this[i].remove();
        }
        return this;
    }


    css(cssToChange, str) {
        for (let i = 0; i < this.length; i++) {
            this.cssStyleChanger(this[i], cssToChange, str);
        }
        return this;
    }

    toggleClass(classStr) {
        for (let i = 0; i < this.length; i++) {
            this[i].classList.toggle(classStr);
        }
        return this;
    }

    onSubmit(func) {
        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener("submit", func);
        }
        return this;
    }
    // __('#main_form').onSubmit(function (evt){console.log(__('#username')[0].value)});


    onInput(func) {
        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener("keyup", func);
        }
        return this;
    }
    // __('#main_form').onInput(function (evt){console.log(evt.target.value)});



    /** Helper functions */

    queryParser(query) {
        let retArr = [];
        if (typeof query === 'string' || query instanceof String) {
            if (query.slice(0, 1) === "#") {
                retArr.push("id");
                retArr.push(query.slice(1));
            }
            else if (query.slice(0, 1) === ".") {
                retArr.push("class");
                retArr.push(query.slice(1));
            } else {
                retArr.push("tag");
                retArr.push(query);
            }
        }

        return retArr;
    };

    cssStyleChanger(element, cssToChange, str) {
        element.style[cssToChange] = str;
    };
}




function __(query) {

    const makeBelieve = new MakeBelieve();

    if (query) {
        let queryArr = document.querySelectorAll(query);
        for (let i = 0; i < queryArr.length; i++) {
            makeBelieve.push(queryArr[i]);
        }
    }
    return makeBelieve;
}


// MBAjak 
__.ajax = function ({
    url, //req
    method = 'GET',
    timeout = 0,
    data = {},
    headers = [],
    success = null,
    fail = null,
    beforeSend = null }) {

    const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
    method = method.toUpperCase();

    //validate
    if (url == null) {
        return new Error("url is requered")
    }

    if (!allowedMethods.includes(method)) {
        return new Error("method " + method + " is unknown");
    }

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState === 1) {
            beforeSend(xhr);
        } else if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                success(this);
            } else {
                fail(this)
            }
        }
    };

    xhr.open(method, url, true);
    xhr.timeout = timeout * 1000;

    headers.forEach(obj => {
        for (o in obj) {
            xhr.setRequestHeader(o, obj[o]);
        }
    });


    if (["POST", "PUT"].includes(method)) {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}