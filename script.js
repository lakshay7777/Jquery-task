$(document).ready(function () {
    var data = JSON.parse(localStorage.getItem('data')) || [];

    function saveData() {
        localStorage.setItem('data', JSON.stringify(data));
    }

    function loadData() {
        $(".main-content, .heading-select, .heading-form-select").empty();
        data.forEach(function (heading) {
            $(".heading-select, .heading-form-select").append(
                $("<option>").val(heading.heading).text(heading.heading)
            );
            var $headingElement = $(`<section class="heading-container"><h2>${heading.heading}</h2></section>`).appendTo(".main-content");

            heading.subheading.forEach(function (subheading) {
                $(`<div style="margin-left:30px" class="subheading-container"><h3>${subheading}</h3></div>`).insertAfter($headingElement.find("h2"));
            });

            heading.inputs.forEach(function (input) {
                $(`<div class="input-container"><label>${input.label}</label>${getInputHTML(input)}</div>`)
                    .insertAfter($headingElement.find(`h3:contains('${input.subheading}')`));
            });
        });
        populateSubheadingsDropdown($(".heading-form-select").val());
    }

    function addHeading(newHeading) {
        $(".heading-select, .heading-form-select").append($("<option>").val(newHeading).text(newHeading));
        $(".main-content").append(`<section class="heading-container"><h2>${newHeading}</h2></section>`);
        data.push({ heading: newHeading, subheading: [], inputs: [] });
        saveData();
    }

    function addSubheading(selectedHeading, newSubheading) {
        var $headingElement = $(".main-content").find(`h2:contains('${selectedHeading}')`);
        $(`<div style="margin-left:30px;" class="subheading-container"><h3>${newSubheading}</h3></div>`).insertAfter($headingElement);
        data.find(h => h.heading === selectedHeading).subheading.push(newSubheading);
        saveData();
        populateSubheadingsDropdown(selectedHeading);
    }

    function populateSubheadingsDropdown(selectedHeading) {
        var subheadings = data.find(h => h.heading === selectedHeading)?.subheading || [];
        $(".subheading-form-select").html(subheadings.map(s => `<option value="${s}">${s}</option>`).join(''));
    }

    function addFormInput(selectedHeading, selectedSubheading, inputType, options) {
        var headingData = data.find(h => h.heading === selectedHeading);
        headingData.inputs.push({ subheading: selectedSubheading, type: inputType, ...options });
        $(".main-content")
            .find(`h2:contains('${selectedHeading}')`)
            .nextAll(".subheading-container")
            .find(`h3:contains('${selectedSubheading}')`)
            .after(`<div style="margin-left:20px;" class="input-container"><label>${options.label}</label>${getInputHTML({ type: inputType, ...options })}</div>`);
        saveData();
        $(".form-inputs").find("input, textarea, select").val("");
        $(".form-inputs").find('input[type="checkbox"], input[type="radio"]').prop("checked", false);
    }

    function getInputHTML(input) {
        switch (input.type) {
            case "textarea":
                return `<textarea class="${input.class}" placeholder="${input.placeholder}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}>${input.value}</textarea>`;
            case "select":
                return `<select class="${input.class}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}>${input.option.split(",").map(option => `<option value="${option}"${input.value === option ? " selected" : ""}>${option}</option>`).join('')}</select>`;
            case "checkbox":
            case "radio_button":
                return `<div class="form-check form-check-inline">${input.option.split(",").map(option => `<input type="${input.type === 'checkbox' ? 'checkbox' : 'radio'}" name="${input.type === 'radio_button' ? 'radio-group' : ''}" class="${input.class}" value="${option}"${input.value.includes(option) ? " checked" : ""}${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}><label class="form-check-label">${option}</label>`).join('')}</div>`;
            default:
                return `<input type="${input.type}" class="${input.class}" placeholder="${input.placeholder}" value="${input.value}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}>`;
        }
    }

    $(".heading-form").on("submit", function (e) {
        e.preventDefault();
        var newHeading = $(".heading-input").val().trim();
        if (newHeading) {
            $(".heading").modal("hide");
            addHeading(newHeading);
            $(".heading-input").val("");
        }
    });

    $(".subheading-form").on("submit", function (e) {
        e.preventDefault();
        var selectedHeading = $(".heading-select").val();
        var newSubheading = $(".subheading-input").val().trim();
        if (selectedHeading && newSubheading) {
            $(".subheading").modal("hide");
            addSubheading(selectedHeading, newSubheading);
            $(".subheading-input, .heading-select").val("");
        }
    });

    $(".heading-form-select").on("change", function () {
        populateSubheadingsDropdown($(this).val());
    });

    $(".form-inputs").on("submit", function (e) {

        e.preventDefault();
        var selectedHeading = $(".heading-form-select").val();
        var selectedSubheading = $(".subheading-form-select").val();
        var inputType = $(".choose-input-type").val();
        var inputOptions = {
            label: $(".input-label").val(),
            class: $(".input-class").val(),
            placeholder: $(".input-placeholder").val(),
            value: $(".input-value").val(),
            option: $(".input-option").val(),
            readonly: $(".input-readonly").prop("checked"),
            disabled: $(".input-disabled").prop("checked"),
            required: $(".input-required").prop("checked")
        };

        if (inputOptions.readonly && inputOptions.disabled) {
            alert("Please select only one of readonly or disabled.");
            return;
        }

        if (selectedHeading && selectedSubheading && inputType) {
            $(".form").modal("hide");
            addFormInput(selectedHeading, selectedSubheading, inputType, inputOptions);
        }
    });

    $(document).on('change', '.input-container input, .input-container textarea, .input-container select', function () {
        var $input = $(this);
        var value = $input.val();
        if ($input.attr('type') === 'checkbox') {
            value = $input.closest('.form-check-inline').find('input:checked').map(function () { return $(this).val(); }).get();
        }
        if ($input.attr('type') === 'radio') {
            value = $input.closest('.form-check-inline').find('input:checked').val();
        }

        var headingText = $input.closest('.heading-container').find('h2').text();
        var subheadingText = $input.closest('.subheading-container').find('h3').text();
        var headingData = data.find(h => h.heading === headingText);
        var inputData = headingData.inputs.find(i => i.subheading === subheadingText && i.label === $input.prev('label').text());
        if (inputData) {
            inputData.value = value;
            saveData();
        }
    });

    loadData();

    $('.form').on('show.bs.modal', function () {
        populateSubheadingsDropdown($(".heading-form-select").val());
    });
});
