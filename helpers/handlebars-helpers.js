module.exports = {
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
    },
    inc: function (val) {
        return val + 1;
    },
    add: function (val1, val2) {
        return val1 + val2;
    },
    paginate: function (options) {
        var currentPage = parseInt(options.hash.current);
        var pages = options.hash.pages;
        var output = "";
        if (currentPage == 1) {
            output += `<li class='page-item disabled'>
                <a class="page-link page-link-prev"  aria-label="Previous" tabindex="-1" aria-disabled="true">
                    <span aria-hidden="true"><i class="icon-long-arrow-left"></i></span>Prev
                </a></li>`;
        }
        else {
            output += `<li class='page-item'>
            <a onclick="pageChange(${currentPage-1})" class="page-link page-link-prev"  aria-label="Previous" tabindex="-1" aria-disabled="true">
                <span aria-hidden="true"><i class="icon-long-arrow-left"></i></span>Prev
            </a></li>`;
        }

        let i = (Number(currentPage) > 5 ? Number(currentPage) - 4 : 1);

        if (i !== 1) {
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }
        for (; i <= (Number(currentPage) + 4) && i <= pages; i++) {
            if (i == currentPage) {
                output += `<li class="page-item active" aria-current="page"><a class="page-link" >${i}</a></li>`;
            } else {
                output += `<li class="page-item"><a onclick="pageChange(${i})" class="page-link" >${i}</a></li>`;
            }


            if (i === Number(currentPage) + 4 && i < pages) {
                output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
        }

        if (currentPage == pages) {
            output += `<li class="page-item disabled">
            <a class="page-link page-link-next"  aria-label="Next">
                Next <span aria-hidden="true"><i class="icon-long-arrow-right"></i></span>
            </a>
        </li>`;
        }
        else {
            output += `<li class="page-item">
            <a onclick="pageChange(${currentPage+1})" class="page-link page-link-next"  aria-label="Next">
                Next <span aria-hidden="true"><i class="icon-long-arrow-right"></i></span>
            </a>
        </li>`;
        }
        return output;
    },
    isPermitted: function (options) {
        var fnTrue = options.fn, fnFalse = options.inverse;
        var permition_array = options.hash.permition_array;
        var module_id = options.hash.module_id;
        var x= permition_array.indexOf(module_id+"");
        if(x!=-1)
            return fnTrue(this);
        else
            return fnFalse(this);
    },
    ifCond : function(v1, operator, v2, options){
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    }
};