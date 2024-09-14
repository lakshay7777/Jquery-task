$(document).ready(function () {
    $('.heading-form').on('submit', function (e) {
        e.preventDefault();

        var newHeading = $('.heading-input').val().trim();
        if (newHeading) {
            $('.heading').modal('hide');
            $('.heading-select').append($('<option>').val(newHeading).text(newHeading));
            $('.heading-form-select').append($('<option>').val(newHeading).text(newHeading));
            $('.main-content').append(`
                <div class="heading-container">
                    <h2>${newHeading}</h2>
                </div>
            `);
            $('.heading-input').val('');
            $('.newHeading').val('');
            console.log(newHeading, "Heading added");
        }
    });


    $('.subheading-form').on('submit', function (e) {
        e.preventDefault();
        var selectedHeading = $('.heading-select').val();
        var newSubheading = $('.subheading-input').val().trim();

        if (selectedHeading && newSubheading) {
            $('.subheading').modal('hide');
            $('.main-content').find("h2:contains('" + selectedHeading + "')").after(`
                <div class="subheading-container">
                    <h3>${newSubheading}</h3>
                </div>
            `);
            $('.subheading-input').val('');
            $('.heading-select').val('');
            console.log(newSubheading, "Subheading added");
        }
    });


    $('.heading-form-select').on('change', function () {
        var selectedHeading = $(this).val();
        var subheadings = [];


        $('.main-content').find("h2:contains('" + selectedHeading + "')").nextAll('div.subheading-container').each(function () {
            subheadings.push($(this).find('h3').text());
        });

        var subheadingSelect = $('.subheading-form-select');
        subheadingSelect.empty();
        subheadingSelect.append('<option selected disabled>Select a subheading</option>');
        $.each(subheadings, function (index, subheading) {
            subheadingSelect.append($('<option>').val(subheading).text(subheading));
            $('.newHeading').val('');
        });
    });

    $('.form-inputs').on('submit', function (e) {
        e.preventDefault();

        var selectedHeading = $('.heading-form-select').val();
        var selectedSubheading = $('.subheading-form-select').val();
        var inputType = $('.choose-input-type').val();
        var inputTypeSpecificOptions = {};

        if (inputType) {
            
            inputTypeSpecificOptions.type = $('.input-type').val();
            inputTypeSpecificOptions.label = $('.input-label').val();
            inputTypeSpecificOptions.class = $('.input-class').val();
            inputTypeSpecificOptions.placeholder = $('.input-placeholder').val();
            inputTypeSpecificOptions.value = $('.input-value').val();
            inputTypeSpecificOptions.option = $('.input-option').val();
            inputTypeSpecificOptions.readonly = $('.input-readonly').prop('checked');
            inputTypeSpecificOptions.disabled = $('.input-disabled').prop('checked');
        }

        if (selectedHeading && selectedSubheading && inputType) {
            $('.form').modal('hide');
            var inputHTML = '';

            switch (inputType) {
                case 'input':
                    inputHTML = `<input type="${inputTypeSpecificOptions.type}" class="${inputTypeSpecificOptions.class}" placeholder="${inputTypeSpecificOptions.placeholder}" value="${inputTypeSpecificOptions.value}" ${inputTypeSpecificOptions.readonly ? 'readonly' : ''} ${inputTypeSpecificOptions.disabled ? 'disabled' : ''}>`;
                    break;
                case 'textarea':
                    inputHTML = `<textarea class="${inputTypeSpecificOptions.class}" placeholder="${inputTypeSpecificOptions.placeholder}" ${inputTypeSpecificOptions.readonly ? 'readonly' : ''} ${inputTypeSpecificOptions.disabled ? 'disabled' : ''}>${inputTypeSpecificOptions.value}</textarea>`;
                    break;
                case 'select':
                    inputHTML = `<select class="${inputTypeSpecificOptions.class}" ${inputTypeSpecificOptions.readonly ? 'readonly' : ''} ${inputTypeSpecificOptions.disabled ? 'disabled' : ''}>`;
                    $.each(inputTypeSpecificOptions.option.split(','), function (index, option) {
                        inputHTML += `<option value="${option}">${option}</option>`;
                    });
                    inputHTML += `</select>`;
                    break;
                case 'checkbox':
                    inputHTML = `<div class="form-check">`;
                    $.each(inputTypeSpecificOptions.option.split(','), function (index, option) {
                        inputHTML += `<input type="checkbox" class="${inputTypeSpecificOptions.class}" value="${option}" ${inputTypeSpecificOptions.readonly ? 'readonly' : ''} ${inputTypeSpecificOptions.disabled ? 'disabled' : ''}>`;
                        inputHTML += `<label class="form-check-label">${option}</label>`;
                        inputHTML += `</div>`;
                    });
                    break;
                case 'radio_button':
                    inputHTML = `<div class="form-check">`;
                    $.each(inputTypeSpecificOptions.option.split(','), function (index, option) {
                        inputHTML += `<input type="radio" name="radio-group" class="${inputTypeSpecificOptions.class}" value="${option}" ${inputTypeSpecificOptions.readonly ? 'readonly' : ''} ${inputTypeSpecificOptions.disabled ? 'disabled' : ''}>`;
                        inputHTML += `<label class="form-check-label">${option}</label>`;
                        inputHTML += `</div>`;
                    });
                    break;
                case 'button':
                    inputHTML = `<button type="button" class="${inputTypeSpecificOptions.class}" ${inputTypeSpecificOptions.readonly ? 'readonly' : ''} ${inputTypeSpecificOptions.disabled ? 'disabled' : ''}>${inputTypeSpecificOptions.value}</button>`;
                    break;
            }

            $('.main-content').find("h2:contains('" + selectedHeading + "')").nextAll('div.subheading-container').find("h3:contains('" + selectedSubheading + "')").after(`
                <div class="input-container">
                    <label>${inputTypeSpecificOptions.label}</label>
                    ${inputHTML}
                </div>
            `);
            console.log("Form input added");
        }
    });
});
