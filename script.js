$(document).ready(function () {
    var headings = [];
    var subHeadings = {};

    $('#save-button').on('click', function () {
        var heading = $('#message-text').val();
        var headingId = `heading-${headings.length}`; // generate a unique ID
        $('#display-heading').append(`<h1 id="${headingId}">${heading}</h1>`)
        $('#Modal1').modal('hide');
        headings.push({ id: headingId, text: heading }); // add heading to the array with ID
        console.log(heading, '####################3')
    });

    $('#exampleModal22').on('show.bs.modal', function () {
        // populate the select dropdown with headings
        var selectHeading = $('#select-heading');
        selectHeading.empty();
        $.each(headings, function (index, heading) {
            selectHeading.append(`<option value="${heading.id}">${heading.text}</option>`);
        });
    });

    $('#save-sub-heading').on('click', function () {
        var selectedHeadingId = $('#select-heading').val();
        var subHeading = $('#sub-heading-text').val();
        $(`#${selectedHeadingId}`).append(`<h2>${subHeading}</h2>`); // append to the correct element
        $('#exampleModal22').modal('hide');
        // add subheading to the subHeadings object
        if (!subHeadings[selectedHeadingId]) {
            subHeadings[selectedHeadingId] = [];
        }
        subHeadings[selectedHeadingId].push(subHeading);
    });

    $('#exampleModal33').on('show.bs.modal', function () {
        // populate the select dropdown with headings
        var selectHeading = $('#select-heading-3'); // updated selector
        selectHeading.empty();
        $.each(headings, function (index, heading) {
            selectHeading.append(`<option value="${heading.id}">${heading.text}</option>`);
        });

        // trigger the selectHeading change event handler
        $('#select-heading-3').trigger('change');
    });

    $('#select-heading-3').on('change', function () {
        var selectedHeadingId = $(this).val();
        var selectSubHeading = $('#select-sub-heading');
        selectSubHeading.empty();
        if (subHeadings[selectedHeadingId]) {
            $.each(subHeadings[selectedHeadingId], function (index, subHeading) {
                selectSubHeading.append(`<option value="${subHeading}">${subHeading}</option>`);
            });
        }
    });
});

