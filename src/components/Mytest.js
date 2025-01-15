

export function numberproviderCheck(data) {
    const requiredFields = ['mobNo', 'Provider'];
    for (const field of requiredFields) {
        if (!data[field]) {
            return false;
        }
    }
    return true;
}


export function checkboxCheck(data) {
    const requiredFields = ['cdr', 'CAF', 'address'];
    for (const field of requiredFields) {
        if (data[field] === 1||data[field] === "1") {  
            return 1;  
        }
    }
    return 0;  
}


export function dateChecking(data) {
    if (data.cdr === "1" || data.cdr === 1) {
        if (data.fdate === "" || data.tdate === "") {
            return false;
        }
        const fDateObj = new Date(data.fdate);
        const tDateObj = new Date(data.tdate);
        if (fDateObj > tDateObj) {
            return false;
        }
        return true;
    }
    return false;
}
