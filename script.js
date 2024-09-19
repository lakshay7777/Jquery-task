$(document).ready(function () {
    var data = JSON.parse(localStorage.getItem('data')) || [];

    function saveData() {
        localStorage.setItem('data', JSON.stringify(data));
    }

    function loadData() {
        $(".main-content").empty();
        $(".heading-select").empty();
        $(".heading-form-select").empty();

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
                    <div style="margin-left:40px;" class="subheading-container">
                        <h3>${subheading}</h3>
                    </div>
                `);
            });

            $.each(heading.inputs, function (inputIndex, input) {
                var $subheadingElement = $(".main-content")
                    .find("h3")
                    .filter(function () {
                        return $(this).text().trim() === input.subheading;
                    });
                $subheadingElement.after(`
                    <div class="input-container">
                        <label>${input.label}</label>
                        ${getInputHTML(input)}
                    </div>
                `);
            });
        });

        populateSubheadingsDropdown($(".heading-form-select").val());
    }

    function addHeading(newHeading) {
        $(".heading-select").append(
            $("<option>").val(newHeading).text(newHeading)
        );
        $(".heading-form-select").append(
            $("<option>").val(newHeading).text(newHeading)
        );
        $(".main-content").append(`
            <section class="heading-container">
                <h2>${newHeading}
                <button type="button" class="close2" aria-label="Close"><span aria-hidden="true">x</span></button></h2>
            </section>
        `);
        data.push({
            heading: newHeading,
            subheading: [],
            inputs: []
        });
        saveData();
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
                <div style="margin-left:46px;" class="subheading-container">
                    <h3>${newSubheading}</h3>
                </div>
            `);
        } else {
            $headingElement.after(`
                <div style="margin-left:10px;" class="subheading-container">
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
        saveData();
        console.log(newSubheading, "Subheading added");
        
      
        populateSubheadingsDropdown(selectedHeading);
    }

    function populateSubheadingsDropdown(selectedHeading) {
        var subheadings = [];
        var headingIndex = data.findIndex(function (heading) {
            return heading.heading === selectedHeading;
        });
        if (headingIndex !== -1) {
            subheadings = data[headingIndex].subheading;
        }

        var subheadingSelect = $(".subheading-form-select");
        subheadingSelect.empty();
        $.each(subheadings, function (index, subheading) {
            subheadingSelect.append($("<option>").val(subheading).text(subheading));
        });
    }

    function addFormInput(selectedHeading, selectedSubheading, inputType, options) {
        $(".form").modal("hide");
        var inputHTML = getInputHTML({
            type: inputType,
            class: options.class,
            placeholder: options.placeholder,
            value: options.value,
            option: options.option,
            readonly: options.readonly,
            disabled: options.disabled,
            required: options.required
        });

        var headingIndex = data.findIndex(function (heading) {
            return heading.heading === selectedHeading;
        });
        if (headingIndex !== -1) {
            data[headingIndex].inputs.push({
                subheading: selectedSubheading,
                type: inputType,
                label: options.label,
                class: options.class,
                placeholder: options.placeholder,
                value: options.value,
                option: options.option,
                readonly: options.readonly,
                disabled: options.disabled,
                required: options.required
            });
        }

        $(".main-content")
            .find("h2:contains('" + selectedHeading + "')")
            .nextAll("div.subheading-container")
            .find("h3:contains('" + selectedSubheading + "')").after(`
                <div style="margin-bottom:20px;" class="input-container">
                    <label>${options.label}</label>
                    ${inputHTML}
                    <br>
                </div>
            `);

        saveData();
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
            case "textarea":
                inputHTML = `<textarea class="${input.class}" placeholder="${input.placeholder}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}>${input.value}</textarea>`;
                break;
            case "select":
                inputHTML = `<select class="${input.class}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}>`;
                $.each(input.option.split(","), function (index, option) {
                    inputHTML += `<option value="${option}"${input.value === option ? " selected" : ""}>${option}</option>`;
                });
                inputHTML += `</select>`;
                break;
            case "checkbox":
                inputHTML = `<div class="form-check form-check-inline">`;
                $.each(input.option.split(","), function (index, option) {
                    inputHTML += `<input type="checkbox" class="${input.class}" value="${option}"${input.value.includes(option) ? " checked" : ""}${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}>`;
                    inputHTML += `<label class="form-check-label">${option}</label>`;
                });
                inputHTML += `</div>`;
                break;
            case "radio_button":
                inputHTML = `<div class="form-check form-check-inline">`;
                $.each(input.option.split(","), function (index, option) {
                    inputHTML += `<input type="radio" name="radio-group" class="${input.class}" value="${option}"${input.value === option ? " checked" : ""}${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}>`;
                    inputHTML += `<label class="form-check-label">${option}</label>`;
                });
                inputHTML += `</div>`;
                break;
            default:
                inputHTML = `<input type="${input.type}" class="${input.class}" placeholder="${input.placeholder}" value="${input.value}"${input.readonly ? " readonly" : ""}${input.disabled ? " disabled" : ""}${input.required ? " required" : ""}>`;
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
    });

    $(".form-inputs").on("submit", function (e) {
        e.preventDefault();
        var selectedHeading = $(".heading-form-select").val();
        var selectedSubheading = $(".subheading-form-select").val();
        var inputType = $(".choose-input-type").val();
        var inputTypeSpecificOptions = {
            type: inputType,
            label: $(".input-label").val(),
            class: $(".input-class").val(),
            placeholder: $(".input-placeholder").val(),
            value: $(".input-value").val(),
            option: $(".input-option").val(),
            readonly: $(".input-readonly").prop("checked"),
            disabled: $(".input-disabled").prop("checked"),
            required: $(".input-required").prop("checked")
        };

        if (inputTypeSpecificOptions.readonly && inputTypeSpecificOptions.disabled) {
            alert("Please select only one of readonly or disabled.");
            return;
        }

        if (selectedHeading && selectedSubheading && inputType) {
            addFormInput(selectedHeading, selectedSubheading, inputType, inputTypeSpecificOptions);
        }
    });

    
    $(document).on('change', '.input-container input, .input-container textarea, .input-container select', function() {
        var $input = $(this);
        var value = $input.val();
        if ($input.attr('type') === 'checkbox') {
            value = [];
            $input.closest('.form-check-inline').find('input:checked').each(function() {
                value.push($(this).val());
            });
        }
        if ($input.attr('type') === 'radio') {
            value = $input.closest('.form-check-inline').find('input:checked').val();
        }

        var headingText = $input.closest('.heading-container').find('h2').text();
        var subheadingText = $input.closest('.subheading-container').find('h3').text();
        
        var headingIndex = data.findIndex(function(heading) {
            return heading.heading === headingText;
        });

        if (headingIndex !== -1) {
            var inputIndex = data[headingIndex].inputs.findIndex(function(input) {
                return input.subheading === subheadingText && input.label === $input.prev('label').text();
            });

            if (inputIndex !== -1) {
                data[headingIndex].inputs[inputIndex].value = value;
                saveData();
            }
        }
    });


    loadData();

    $('.form').on('show.bs.modal', function () {
        var selectedHeading = $(".heading-form-select").val();
        populateSubheadingsDropdown(selectedHeading);
    });
});
