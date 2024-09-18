$(document).ready(function () {
  
  
    var data = JSON.parse(localStorage.getItem('data')) || [];

    // Load existing data from localStorage
    $.each(data, function (index, heading) {
        $(".heading-select").append(
            $("<option>").val(heading.heading).text(heading.heading)
        );
        $(".heading-form-select").append(
            $("<option>").val(heading.heading).text(heading.heading)
        );
        $(".main-content").append(`
        <section class="heading-container">
          <h2>${heading.heading}</h2>
        </section>
      `);

        $.each(heading.subheading, function (subheadingIndex, subheading) {
            var $headingElement = $(".main-content")
                .find("h2")
                .filter(function () {
                    return $(this).text().trim() === heading.heading;
                });
            $headingElement.after(`
          <div class="subheading-container">
            <h3>${subheading}</h3>
          </div>
        `);
        });

        $.each(heading.inputs, function (inputIndex, input) {
            var $subheadingElement = $(".main-content")
                .find("h3")
                .filter(function () {
                    return $(this).text().trim() === input.label;
                });
            $subheadingElement.after(`
          <div class="input-container">
            <label>${input.label}</label>
            ${getInputHTML(input)}
          </div>
        `);
        });
    });

    function addHeading(newHeading) {
        $(".heading-select").append(
            $("<option>").val(newHeading).text(newHeading)
        );
        $(".heading-form-select").append(
            $("<option>").val(newHeading).text(newHeading)
        );
        $(".main-content").append(`
        <section class="heading-container">
          <h2>${newHeading}</h2>
        </section>
      `);
        data.push({
            heading: newHeading,
            subheading: [],
            inputs: []
        });
        localStorage.setItem('data', JSON.stringify(data));
        console.log(newHeading, "Heading added");
    }

    function addSubheading(selectedHeading, newSubheading) {
        var $headingElement = $(".main-content")
            .find("h2")
            .filter(function () {
                return $(this).text().trim() === selectedHeading;
            });
        var $lastSubheadingContainer = $headingElement
            .nextAll("div.subheading-container")
            .last();

        if ($lastSubheadingContainer.length) {
            $lastSubheadingContainer.after(`
          <div class="subheading-container">
            <h3>${newSubheading}</h3>
          </div>
        `);
        } else {
            $headingElement.after(`
          <div class="subheading-container">
            <h3>${newSubheading}</h3>
          </div>
        `);
        }

        var headingIndex = data.findIndex(function (heading) {
            return heading.heading === selectedHeading;
        });
        if (headingIndex !== -1) {
            data[headingIndex].subheading.push(newSubheading);
        }
        localStorage.setItem('data', JSON.stringify(data));
        console.log(newSubheading, "Subheading added");
    }

    function populateSubheadingsDropdown(selectedHeading) {
        var subheadings = [];
        $(".main-content")
            .find("h2:contains('" + selectedHeading + "')")
            .nextAll("div.subheading-container")
            .each(function () {
                subheadings.push($(this).find("h3").text());
            });

        var subheadingSelect = $(".subheading-form-select");
        subheadingSelect.empty();
        $.each(subheadings, function (index, subheading) {
            subheadingSelect.append($("<option>").val(subheading).text(subheading));
        });
    }

    function addFormInput(selectedHeading, selectedSubheading, inputType, options) {
        $(".form").modal("hide");
        var inputHTML = "";

        if (options.readonly) {
            inputHTML += ` readonly`;
        }

        if (options.disabled) {
            inputHTML += ` disabled`;
        }

        switch (inputType) {
            case "input":
                inputHTML = `<input type="${options.type}" class="${options.class}" placeholder="${options.placeholder}" value="${options.value}"${options.readonly ? " readonly" : ""}${options.disabled ? " disabled" : ""}>`;
                break;
            case "textarea":
                inputHTML = `<textarea class="${options.class}" placeholder="${options.placeholder}"${options.readonly ? " readonly" : ""}${options.disabled ? " disabled" : ""}>${options.value}</textarea>`;
                break;
            case "select":
                inputHTML = `<select class="${options.class}"${options.readonly ? " readonly" : ""}${options.disabled ? " disabled" : ""}>`;
                $.each(options.option.split(","), function (index, option) {
                    inputHTML += `<option value="${option}">${option}</option>`;
                });
                inputHTML += `</select>`;
                break;
            case "checkbox":
                inputHTML = `<div class="form-check form-check-inline">`;
                $.each(options.option.split(","), function (index, option) {
                    inputHTML += `<input type="checkbox" class="${options.class}" value="${option}"${options.readonly ? " readonly" : ""}${options.disabled ? " disabled" : ""}>`;
                    inputHTML += `<label class="form-check-label">${option}</label>`;
                });
                inputHTML += `</div>`;
                break;
            case "radio_button":
                inputHTML = `<div class="form-check form-check-inline">`;
                $.each(options.option.split(","), function (index, option) {
                    inputHTML += `<input type="radio" name="radio-group" class="${options.class}" value="${option}"${options.readonly ? " readonly" : ""}${options.disabled ? " disabled" : ""}>`;
                    inputHTML += `<label class="form-check-label">${option}</label>`;
                });
                inputHTML += `</div>`;
                break;
            case "button":
                inputHTML = `<button type="button" class="${options.class}"${options.readonly ? " readonly" : ""}${options.disabled ? " disabled" : ""}>${options.value}</button>`;
                break;
        }

        var headingIndex = data.findIndex(function (heading) {
            return heading.heading === selectedHeading;
        });
        if (headingIndex !== -1) {
            var subheadingIndex = data[headingIndex].subheading.findIndex(function (subheading) {
                return subheading === selectedSubheading;
            });
            if (subheadingIndex !== -1) {
                data[headingIndex].inputs.push({
                    type: inputType,
                    label: options.label,
                    class: options.class,
                    placeholder: options.placeholder,
                    value: options.value,
                    option: options.option,
                    readonly: options.readonly,
                    disabled: options.disabled
                });
            }
        }

        $(".main-content")
            .find("h2:contains('" + selectedHeading + "')")
            .nextAll("div.subheading-container")
            .find("h3:contains('" + selectedSubheading + "')").after(`
          <div class="input-container">
            <label>${options.label}</label>
            ${inputHTML}
          </div>
        `);

        localStorage.setItem('data', JSON.stringify(data));
        console.log("Form input added");

        $(".form-inputs").find("input").val("");
        $(".form-inputs").find("textarea").val("");
        $(".form-inputs").find("select").val("");
        $(".form-inputs").find('input[type="checkbox"]').prop("checked", false);
        $(".form-inputs").find('input[type="radio"]').prop("checked", false);
    }

    function getInputHTML(input) {
        var inputHTML = "";
        switch (input.type) {
            case "input":
                inputHTML = `<input type="${input.type}" class="${input.class}" placeholder="${input.placeholder}" value="${input.value}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}>`;
                break;
            case "textarea":
                inputHTML = `<textarea class="${input.class}" placeholder="${input.placeholder}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}>${input.value}</textarea>`;
                break;
            case "select":
                inputHTML = `<select class="${input.class}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}>`;
                $.each(input.option.split(","), function (index, option) {
                    inputHTML += `<option value="${option}">${option}</option>`;
                });
                inputHTML += `</select>`;
                break;
            case "checkbox":
                inputHTML = `<div class="form-check form-check-inline">`;
                $.each(input.option.split(","), function (index, option) {
                    inputHTML += `<input type="checkbox" class="${input.class}" value="${option}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}>`;
                    inputHTML += `<label class="form-check-label">${option}</label>`;
                });
                inputHTML += `</div>`;
                break;
            case "radio_button":
                inputHTML = `<div class="form-check form-check-inline">`;
                $.each(input.option.split(","), function (index, option) {
                    inputHTML += `<input type="radio" name="radio-group" class="${input.class}" value="${option}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}>`;
                    inputHTML += `<label class="form-check-label">${option}</label>`;
                });
                inputHTML += `</div>`;
                break;
            case "button":
                inputHTML = `<button type="button" class="${input.class}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}>${input.value}</button>`;
                break;
        }
        return inputHTML;
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
            $(".subheading-input").val("");
            $(".heading-select").val("");
        }
    });

    $(".heading-form-select").on("change", function () {
        var selectedHeading = $(this).val();
        populateSubheadingsDropdown(selectedHeading);
        $(".newHeading").val("");
    });

    $(".form-inputs").on("submit", function (e) {
        e.preventDefault();
        var selectedHeading = $(".heading-form-select").val();
        var selectedSubheading = $(".subheading-form-select").val();
        var inputType = $(".choose-input-type").val();
        var inputTypeSpecificOptions = {
            type: $(".input-type").val(),
            label: $(".input-label").val(),
            class: $(".input-class").val(),
            placeholder: $(".input-placeholder").val(),
            value: $(".input-value").val(),
            option: $(".input-option").val(),
            readonly: $(".input-readonly").prop("checked"),
            disabled: $(".input-disabled").prop("checked")
        };

        if (inputTypeSpecificOptions.readonly && inputTypeSpecificOptions.disabled) {
            alert("Please select only one of readonly or disabled.");
            return;
        }

        if (selectedHeading && selectedSubheading && inputType) {
            addFormInput(selectedHeading, selectedSubheading, inputType, inputTypeSpecificOptions);
        }
    });
});