function SearchableSelect(el) {
    if (!(this instanceof SearchableSelect)) {
        return new SearchableSelect(el);
    }
    //mobile clickevents
    document.addEventListener('touchend',this._selectOption.bind(this), true);
    document.addEventListener('keyup',this._selectOptions.bind(this), true);
    document.addEventListener('click',this._selectOption.bind(this), true);


    this._el = el;
    this._build();

}

//create the html elements needed for the custom select and actual build it
SearchableSelect.prototype._build = function() {
    var options = this._getOptions();
    this._selectOption = this._selectOption.bind(this);
    this._selected = 0;
    var selected = this._selected;

    this._parentWrap = document.createElement('div');
    this._parentWrap.classList.add('custom-select__select');

    this._selectWrap = document.createElement('div');
    this._selectWrap.className = 'custom-select__dropdown';

    //in here will the selected value be shown
    this._valueField = document.createElement('div');
    this._valueField.classList.add('custom-select__value');
    this._valueField.addEventListener('click', this._toggleList.bind(this));
    var field = this._valueField;

    //create the wrapper where we'll put the list in
    this._wrap = document.createElement('div');
    this._wrap.classList.add('custom-select__wrap');

    this._searchWrap = document.createElement('div');
    this._searchWrap.classList.add('custom-select__search-wrap');

    this._search = document.createElement('input');
    this._search.type = 'text';
    this._search.className = 'custom-select__search';
    this._search.addEventListener('input', this._searchList.bind(this));

    this._searchWrap.appendChild(this._search);

    this._options = [];
    var optionArray = this._options;

    //create the needed elements for the custom list
    var ul = document.createElement('ul');
    ul.classList.add('custom-select__list');


    var index = -1;
    options.forEach(function(option){
        index ++;
        li = document.createElement('li');
        li.dataset.value = option.value;
        li.dataset.index = index;
        li.textContent = option.label;

        //setting selected state on first item
        if (li.dataset.index === '0') {
            li.classList.add('selected');
            field.textContent = li.textContent;
            selected = li.dataset.index;
        }

        ul.appendChild(li);
        optionArray.push(li);

    })

    // this._wrap.appendChild(this._search);
    this._wrap.appendChild(ul);
    this._parentWrap.appendChild(this._valueField);
    this._selectWrap.appendChild(this._searchWrap);
    this._selectWrap.appendChild(this._wrap);
    this._parentWrap.appendChild(this._selectWrap);

    //and finally replacing the default select
    this._el.parentNode.replaceChild(this._parentWrap, this._el);
};

//open list
SearchableSelect.prototype._openList = function(el) {
    el._selectWrap.classList.add('active');
    el._search.focus();
}

SearchableSelect.prototype._closeList = function(el) {
    el._selectWrap.classList.remove('active');
}
//toggle list
SearchableSelect.prototype._toggleList = function() {
    var openList = this._openList;
    if (this._selectWrap.classList.contains('active')) {
        this._closeList(this);
    }else{
        this._openList(this);
    }
}

//get all the options from the default select
SearchableSelect.prototype._getOptions = function() {
    var options = this._el.querySelectorAll('option');

    //returning options as objects
    return [].map.call(options, function(option){
        option.onclick = this._selectOption;
        return {
            value: option.value,
            label: option.textContent
        };
    });
}

//search trough the list
SearchableSelect.prototype._searchList = function () {
    var obj = {};
    var options = this._getOptions();
    var filteredList = [].filter.call(options, this._filterList);

    this._wrap.innerHTML = '';

    var ul = document.createElement('ul');
    ul.classList.add('custom-select__list');

    var index = 0;
    filteredList.forEach(function(option){
        index ++;

        var li = document.createElement('li');
        li.dataset.value = option.value;
        li.dataset.index = index;
        li.textContent = option.label;

        if (li.dataset.index === '1') {
            li.classList.add('selected');
        }
        ul.appendChild(li);
    })

    this._wrap.appendChild(ul);
}

//filter the the list and return the options who match the query
SearchableSelect.prototype._filterList = function(option) {
    var input = event.target.value;
    var re = new RegExp(input.replace(' ', '').toLowerCase());

    if (re.test(option.label.replace(' ', '').toLowerCase())) {
        return option;
    }
}

//select option on click
SearchableSelect.prototype._selectOption = function() {
    if (event.target.parentNode.className != 'custom-select__list') { return; }
    var option = event.target;
    //removing the old selected state
    this._options[this._selected].classList.remove('selected');

    //update field
    this._valueField.textContent = option.textContent;

    //set new selected field
    this._selected = option.dataset.index;
    option.classList.add('selected');
    this._selectWrap.classList.remove('active');
}

//keynavigation for selecting nex, previous and for selecting the current option
SearchableSelect.prototype._selectOptions = function(e) {
    var options = this._wrap.querySelectorAll('li');
    var setNextOption = this._setNextOption;
    var setCurrentOption = this._setCurrentOption;
    var optionField = this._valueField;
    var setPreviousOption = this._setPreviousOption;
    var el = this;
    var index = this._selected;

    //go to the next option
    if (e.keyCode === 40) {
        index = parseInt(index, 10);
        index ++;
        if (!el._options[index]) return;
        el._options[el._selected].classList.remove('selected');
        el._options[index].classList.add('selected');
        el._selected = index;
    }

    //go to the previous option
    if(e.keyCode === 38){
        index = index -1 ;

        if (!el._options[index]) return;
        el._options[el._selected].classList.remove('selected');
        el._options[index].classList.add('selected');
        el._selected = index;

    //select the current option
    }else if(e.keyCode === 13){
        if (!el._options[index]) return;
        var selectedItem = el._options[el._selected];
        optionField.textContent = selectedItem.textContent;
        el._selectWrap.classList.remove('active');
    }else{
        return;
    }
}

//on enter select option
SearchableSelect.prototype._setCurrentOption = function(option, optionField, el){
    if (option.classList.contains('selected')) {
        optionField.textContent = option.textContent;
        option.classList.add('selected');
    }
    el._selectWrap.classList.remove('active');
}

//get all the existing selects who needs enhancements
var selects = document.querySelectorAll('[data-searchable-select]');

// enhance each select to be searchable
var searchable;
for (var i = 0; i < selects.length; i++) {
    new SearchableSelect(selects[i]);
}
