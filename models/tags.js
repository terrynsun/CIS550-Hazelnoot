module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Tags", {
        object_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,

            // IGNORE THIS
            // Sequelize wants to insert an 'id' column if we don't have this
            primaryKey: true
        },
        source: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: 'Hazelnoot'
        },
        tag: {
            type: DataTypes.STRING(64),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 64
            }
        }
    }, {
        tableName: "Tags"
    });
};
